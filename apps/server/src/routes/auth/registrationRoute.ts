import { registrationController } from '@/controllers/auth/registrationController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /registration:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register user
 */
router.post('/', registrationController);

export default router;
