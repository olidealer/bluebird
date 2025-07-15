
import { Router } from 'express';
import { getMonthlyData, addIncome, deleteIncome, addExpenses, deleteExpense } from '../controllers/taxController';
import { protect } from '../middleware/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route   GET /api/taxes/:year/:month
 * @desc    Get all income and expenses for a given month and year
 * @access  Private
 */
router.get('/:year/:month', protect, getMonthlyData);

/**
 * @route   POST /api/taxes/:yearMonth/income
 * @desc    Add a new income record
 * @access  Private
 */
router.post('/:yearMonth/income', protect, addIncome);

/**
 * @route   DELETE /api/taxes/income/:id
 * @desc    Delete an income record
 * @access  Private
 */
router.delete('/income/:id', protect, deleteIncome);

/**
 * @route   POST /api/taxes/:yearMonth/expenses
 * @desc    Add new expense records from XML files
 * @access  Private
 */
router.post('/:yearMonth/expenses', protect, upload.array('invoices'), addExpenses);

/**
 * @route   DELETE /api/taxes/expenses/:id
 * @desc    Delete an expense record
 * @access  Private
 */
router.delete('/expenses/:id', protect, deleteExpense);


export default router;
