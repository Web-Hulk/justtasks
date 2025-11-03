import { Router } from 'express';
import { registrationController } from '../controllers/registrationController';

const router = Router();

router.post('/registration', registrationController);

export default router;