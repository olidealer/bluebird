
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import taxRoutes from './routes/taxes';
import pdfRoutes from './routes/pdfs';
import settingsRoutes from './routes/settings';

// Load environment variables
dotenv.config();

export const prisma = new PrismaClient();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/taxes', taxRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/settings', settingsRoutes);

// Default route for health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Create a default user and settings on first startup
async function main() {
  // Seed database
  const demoUser = await prisma.user.findUnique({ where: { username: 'demo' }});
  if (!demoUser) {
    const bcrypt = await import('bcryptjs');
    console.log('Creating demo user...');
    await prisma.user.create({
      data: {
        username: 'demo',
        email: 'demo@example.com',
        password: await bcrypt.hash('demo', 10)
      }
    });
  }

  const settings = await prisma.appearanceSettings.findFirst();
  if (!settings) {
    console.log('Creating default appearance settings...');
    await prisma.appearanceSettings.create({
      data: {
        appName: "Rental Property Tax",
        logoUrl: "/logo.svg", // A default logo in frontend/public
        primaryColor: "#007A87",
      }
    });
  }
}

main().catch(e => {
  console.error(e);
  (process as any).exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});