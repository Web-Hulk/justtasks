import { Router } from 'express';
import { generateActivationLinkController } from '../../controllers/auth/generateActivationLinkController.js';

const router = Router();

router.post('/', generateActivationLinkController);

export default router;
