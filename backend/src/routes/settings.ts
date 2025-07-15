
import { Router } from 'express';
import { getAppearanceSettings, updateAppearanceSettings } from '../controllers/settingsController';
import { protect } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/settings/appearance
 * @desc    Get UI appearance settings
 * @access  Public
 */
router.get('/appearance', getAppearanceSettings);

/**
 * @route   PUT /api/settings/appearance
 * @desc    Update UI appearance settings (Admin only)
 * @access  Private
 */
// In a real app, you'd add an admin role check middleware here
router.put('/appearance', protect, updateAppearanceSettings);

export default router;
