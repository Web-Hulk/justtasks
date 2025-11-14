import { activationStatusController } from '@/controllers/auth/activationStatusController';
import { Router } from 'express';

const router = Router();

router.get('/', activationStatusController);

export default router;
