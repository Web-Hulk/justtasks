import { Router } from 'express';
import { registrationController } from '../controllers/registrationController';

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