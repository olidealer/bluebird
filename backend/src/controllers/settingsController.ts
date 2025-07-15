
import { Request, Response } from 'express';
import { prisma } from '../server';

/**
 * Retrieves the current appearance settings.
 * Creates default settings if none exist.
 */
export const getAppearanceSettings = async (req: Request, res: Response) => {
    let settings = await prisma.appearanceSettings.findFirst();

    if (!settings) {
        // This is a fallback in case the seed script in server.ts fails
        settings = await prisma.appearanceSettings.create({
            data: {
                appName: "Rental Property Tax",
                logoUrl: "/logo.svg",
                primaryColor: "#007A87",
            }
        });
    }

    res.json(settings);
};

/**
 * Updates the appearance settings.
 * NOTE: In a real application, this should be protected by an admin role check.
 */
export const updateAppearanceSettings = async (req: Request, res: Response) => {
    // Here you would check if req.user is an admin
    // For this demo, we allow any authenticated user to change it.
    
    const { appName, logoUrl, primaryColor } = req.body;
    let settings = await prisma.appearanceSettings.findFirst();

    if (!settings) {
        return res.status(404).json({ message: 'Settings not found' });
    }

    const updatedSettings = await prisma.appearanceSettings.update({
        where: { id: settings.id },
        data: {
            appName,
            logoUrl,
            primaryColor,
        },
    });

    res.json(updatedSettings);
};
