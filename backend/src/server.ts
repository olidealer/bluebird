
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import * as process from 'process';
import prisma from './db';

import authRoutes from './routes/authRoutes';
import taxRoutes from './routes/taxRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/tax-data', taxRoutes);
app.use('/api/user', userRoutes);


// --- Seeding Logic ---
const seedDatabase = async () => {
    try {
        const demoUser = await prisma.user.findUnique({
            where: { username: 'demo' },
        });

        if (!demoUser) {
            console.log('Demo user not found, creating one...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('demo', salt);

            await prisma.user.create({
                data: {
                    username: 'demo',
                    password: hashedPassword,
                    appearanceSettings: {
                        create: {
                            theme: 'dark',
                            language: 'en',
                        },
                    },
                },
            });
            console.log('Demo user created successfully.');
        } else {
            console.log('Demo user already exists.');
        }
    } catch (error) {
        console.error('Error during database seeding:', error);
    }
};

// --- Server Startup ---
const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully.');
        
        await seedDatabase();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database', error);
        process.exit(1);
    }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});