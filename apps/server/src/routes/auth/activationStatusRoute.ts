import { Router } from 'express';
import { activationStatusController } from '../../controllers/auth/activationStatusController.js';

const router = Router();

router.get('/', activationStatusController);

export default router;
