
import { Router } from 'express';
import { getGeneratedPdfs, addGeneratedPdf } from '../controllers/pdfController';
import { protect } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/pdfs
 * @desc    Get a list of all generated PDFs for the user
 * @access  Private
 */
router.get('/', protect, getGeneratedPdfs);

/**
 * @route   POST /api/pdfs
 * @desc    Log a newly generated PDF
 * @access  Private
 */
router.post('/', protect, addGeneratedPdf);

export default router;
