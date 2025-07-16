
import { Router } from 'express';
import { getAppearanceSettings, updateAppearanceSettings } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/settings/appearance')
    .get(getAppearanceSettings)
    .put(updateAppearanceSettings);

export default router;