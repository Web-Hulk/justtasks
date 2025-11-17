import { Router } from 'express';
import { profileController } from '../controllers/profileController.js';
import { authorizeToken } from '../middlewares/authorizeToken.js';

const router = Router();

router.get('/', authorizeToken, profileController);

export default router;
