import { profileController } from '@/controllers/profileController';
import { authorizeToken } from '@/middlewares/authorizeToken';
import { Router } from 'express';

const router = Router();

router.get('/', authorizeToken, profileController);

export default router;
