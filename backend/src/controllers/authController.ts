
import { Request, Response } from 'express';
import { prisma } from '../server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

/**
 * Handles user registration.
 * Hashes the password and creates a new user in the database.
 */
export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const userExists = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] }
    });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });

    if (user) {
        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

/**
 * Handles user login.
 * Compares password and returns a JWT if successful.
 */
export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};
