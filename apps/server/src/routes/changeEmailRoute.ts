import { Router } from 'express';
import { changeEmailController } from '../controllers/changeEmailController.js';
import { authorizeToken } from '../middlewares/authorizeToken.js';

const router = Router();

router.post('/', authorizeToken, changeEmailController);

export default router;
