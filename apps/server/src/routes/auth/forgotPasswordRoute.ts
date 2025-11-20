import { Router } from 'express';
import { forgotPasswordController } from '../../controllers/auth/forgotPasswordController.js';

const router = Router();

router.post('/', forgotPasswordController);

export default router;
