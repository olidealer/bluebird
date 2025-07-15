
import { Request, Response } from 'express';
import { prisma } from '../server';

/**
 * Retrieves the list of generated PDFs for the authenticated user.
 */
export const getGeneratedPdfs = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const pdfs = await prisma.generatedPdf.findMany({
        where: { userId: req.user.id },
        orderBy: { generatedAt: 'desc' },
    });

    res.json(pdfs);
};

/**
 * Adds a record of a newly generated PDF.
 * If a PDF for the same month/year already exists, it's updated.
 */
export const addGeneratedPdf = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const { yearMonth, fileName } = req.body;

    const existingPdf = await prisma.generatedPdf.findFirst({
        where: { userId: req.user.id, yearMonth },
    });

    if (existingPdf) {
        const updatedPdf = await prisma.generatedPdf.update({
            where: { id: existingPdf.id },
            data: { fileName, generatedAt: new Date() },
        });
        return res.status(200).json(updatedPdf);
    }
    
    const newPdf = await prisma.generatedPdf.create({
        data: {
            yearMonth,
            fileName,
            generatedAt: new Date(),
            userId: req.user.id,
        },
    });

    res.status(201).json(newPdf);
};
