
import { Request, Response } from 'express';
import { prisma } from '../server';
import bcrypt from 'bcryptjs';

/**
 * Gets the profile of the currently authenticated user.
 */
export const getUserProfile = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, username: true, email: true, createdAt: true },
    });

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

/**
 * Updates the profile (username, email) of the authenticated user.
 */
export const updateUserProfile = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const { username, email } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { username, email },
            select: { id: true, username: true, email: true },
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating profile. Username or email may be taken.' });
    }
};

/**
 * Changes the password for the authenticated user.
 */
export const changePassword = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide old and new passwords.' });
    }
    
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user && (await bcrypt.compare(oldPassword, user.password))) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword },
        });
        
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(400).json({ message: 'Old password is incorrect' });
    }
};
