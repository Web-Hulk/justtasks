import { forgotPasswordController } from '@/controllers/auth/forgotPasswordController';
import { Router } from 'express';

const router = Router();

router.post('/', forgotPasswordController);

export default router;
