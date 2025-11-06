import { refreshController } from '@/controllers/auth/refreshController';
import { Router } from 'express';

const router = Router();

router.post('/', refreshController);

export default router;
