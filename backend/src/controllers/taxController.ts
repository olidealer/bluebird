
import { Request, Response } from 'express';
import { prisma } from '../server';
import { parseInvoiceXML } from '../services/xmlParser';

/**
 * Fetches all income and expense data for a specific user, year, and month.
 */
export const getMonthlyData = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const { year, month } = req.params;
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;

    const income = await prisma.incomeRecord.findMany({
        where: { userId: req.user.id, yearMonth },
        orderBy: { createdAt: 'desc' },
    });

    const expenses = await prisma.invoice.findMany({
        where: { userId: req.user.id, yearMonth },
        orderBy: { date: 'desc' },
    });

    res.json({ income, expenses });
};

/**
 * Adds a new income record for the authenticated user.
 */
export const addIncome = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const { yearMonth } = req.params;
    const { totalAmount, includesIva, description } = req.body;

    const income = await prisma.incomeRecord.create({
        data: {
            yearMonth,
            totalAmount: parseFloat(totalAmount),
            includesIva,
            description,
            userId: req.user.id,
        },
    });

    res.status(201).json(income);
};

/**
 * Deletes an income record by its ID.
 */
export const deleteIncome = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const { id } = req.params;
    const income = await prisma.incomeRecord.findUnique({ where: { id } });

    if (income?.userId !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized to delete this record' });
    }

    await prisma.incomeRecord.delete({ where: { id } });
    res.status(200).json({ id });
};

/**
 * Adds new expense records by parsing uploaded XML files.
 */
export const addExpenses = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    if (!req.files || !Array.isArray(req.files)) return res.status(400).json({ message: 'No files uploaded' });

    const { yearMonth } = req.params;
    let successCount = 0;
    let errorCount = 0;
    const addedExpenses = [];

    for (const file of req.files) {
        const xmlString = file.buffer.toString('utf-8');
        const parsedData = parseInvoiceXML(xmlString);

        if (parsedData) {
            try {
                const newExpense = await prisma.invoice.create({
                    data: {
                        ...parsedData,
                        date: new Date(parsedData.date),
                        yearMonth,
                        category: 'Sin categoría',
                        userId: req.user.id,
                    },
                });
                addedExpenses.push(newExpense);
                successCount++;
            } catch (dbError) {
                console.error("DB Error adding expense:", dbError);
                errorCount++;
            }
        } else {
            errorCount++;
        }
    }

    res.status(201).json({
        message: `Carga completa. ${successCount} facturas agregadas, ${errorCount} fallaron.`,
        addedExpenses,
        successCount,
        errorCount
    });
};

/**
 * Deletes an expense record by its ID.
 */
export const deleteExpense = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const { id } = req.params;
    const expense = await prisma.invoice.findUnique({ where: { id } });

    if (expense?.userId !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized to delete this record' });
    }

    await prisma.invoice.delete({ where: { id } });
    res.status(200).json({ id });
};
