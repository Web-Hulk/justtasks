import { resetPasswordController } from '@/controllers/auth/resetPasswordController';
import { Router } from 'express';

const router = Router();

router.post('/', resetPasswordController);

export default router;
