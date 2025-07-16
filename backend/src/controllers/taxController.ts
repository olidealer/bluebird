import { Request, Response } from 'express';
import 'multer';
import prisma from '../db';
import { XMLParser } from 'fast-xml-parser';

// --- Income Records ---

export const getTaxData = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { year, month } = req.query;

    if (!year || !month) {
        return res.status(400).json({ message: 'Year and month are required' });
    }

    const startDate = new Date(parseInt(String(year)), parseInt(String(month)) - 1, 1);
    const endDate = new Date(parseInt(String(year)), parseInt(String(month)), 0, 23, 59, 59);

    try {
        const incomeRecords = await prisma.incomeRecord.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { date: 'asc' },
        });

        const invoices = await prisma.invoice.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { date: 'asc' },
        });

        res.json({ incomes: incomeRecords, expenses: invoices });
    } catch (error) {
        console.error('Error fetching tax data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addIncomeRecord = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { description, date, amount, vat } = req.body;

    if (!description || !date || amount === undefined || vat === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newRecord = await prisma.incomeRecord.create({
            data: {
                userId,
                description,
                date: new Date(date),
                amount: parseFloat(amount),
                vat: parseFloat(vat),
            },
        });
        res.status(201).json(newRecord);
    } catch (error) {
        console.error('Error adding income record:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteIncomeRecord = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;

    try {
        const record = await prisma.incomeRecord.findUnique({ where: { id } });
        if (!record || record.userId !== userId) {
            return res.status(404).json({ message: 'Record not found or not authorized' });
        }
        await prisma.incomeRecord.delete({ where: { id } });
        res.status(200).json({ message: 'Income record deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- Expenses (Invoices) ---

export const uploadInvoices = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
    const createdInvoices = [];
    const errors = [];

    for (const file of files) {
        try {
            const xmlData = file.buffer.toString('utf-8');
            const parsedXml = parser.parse(xmlData);
            
            // Note: This parsing logic is based on a common Costa Rican e-invoice structure.
            // It might need adjustments for different XML schemas.
            const invoiceData = parsedXml['FacturaElectronica'] || parsedXml['TiqueteElectronico'] || parsedXml['NotaCreditoElectronica'];

            if (!invoiceData) {
                errors.push({ fileName: file.originalname, message: 'Unsupported XML root element.' });
                continue;
            }

            const issuerName = invoiceData.Emisor.Nombre;
            const date = new Date(invoiceData.FechaEmision);
            const totalAmount = parseFloat(invoiceData.ResumenFactura.TotalComprobante);
            const vatAmount = parseFloat(invoiceData.ResumenFactura.TotalImpuesto || 0);

            const newInvoice = await prisma.invoice.create({
                data: {
                    userId,
                    issuerName,
                    date,
                    totalAmount,
                    vatAmount,
                    fileName: file.originalname,
                },
            });
            createdInvoices.push(newInvoice);
        } catch (error) {
            console.error(`Error processing file ${file.originalname}:`, error);
            errors.push({ fileName: file.originalname, message: 'Failed to parse or save XML file.' });
        }
    }

    if(createdInvoices.length > 0) {
        res.status(201).json({ message: 'Files processed.', createdInvoices, errors });
    } else {
        res.status(400).json({ message: 'No invoices could be processed.', errors });
    }
};

export const deleteInvoice = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params;

    try {
        const invoice = await prisma.invoice.findUnique({ where: { id } });
        if (!invoice || invoice.userId !== userId) {
            return res.status(404).json({ message: 'Invoice not found or not authorized' });
        }
        await prisma.invoice.delete({ where: { id } });
        res.status(200).json({ message: 'Invoice deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};