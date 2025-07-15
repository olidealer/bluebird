
import { Router } from 'express';
import { getUserProfile, updateUserProfile, changePassword } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', protect, getUserProfile);

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', protect, updateUserProfile);

/**
 * @route   PUT /api/user/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', protect, changePassword);

export default router;
