import { Router } from 'express';
import { changePasswordController } from '../controllers/changePasswordController.js';
import { authorizeToken } from '../middlewares/authorizeToken.js';

const router = Router();

router.post('/', authorizeToken, changePasswordController);

export default router;
