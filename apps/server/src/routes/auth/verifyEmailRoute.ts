import { Router } from 'express';
import { verifyEmailController } from '../../controllers/auth/verifyEmailController.js';

const router = Router();

router.get('/', verifyEmailController);

export default router;
