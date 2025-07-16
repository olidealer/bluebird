
import { Request, Response } from 'express';
import prisma from '../db';

export const getAppearanceSettings = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    try {
        const settings = await prisma.appearanceSettings.findUnique({
            where: { userId },
        });
        if (!settings) {
            // Create default settings if they don't exist
            const newSettings = await prisma.appearanceSettings.create({
                data: {
                    userId,
                    theme: 'system',
                    language: 'en'
                }
            });
            return res.json(newSettings);
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateAppearanceSettings = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { theme, language } = req.body;

    try {
        const updatedSettings = await prisma.appearanceSettings.update({
            where: { userId },
            data: {
                theme,
                language,
            },
        });
        res.json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};