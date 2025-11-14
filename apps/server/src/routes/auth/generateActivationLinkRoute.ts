import { generateActivationLinkController } from '@/controllers/auth/generateActivationLinkController';
import { Router } from 'express';

const router = Router();

router.post('/', generateActivationLinkController);

export default router;
