import { verifyEmailController } from '@/controllers/auth/verifyEmailController';
import { Router } from 'express';

const router = Router();

router.get('/', verifyEmailController);

export default router;
