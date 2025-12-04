import { Router } from 'express';
import { changeEmailController } from '../controllers/changeEmailController.js';
import { verifyAuthorizedEmailController } from '../controllers/verifyAuthorizedEmailController.js';
import { authorizeToken } from '../middlewares/authorizeToken.js';

const router = Router();

router.post('/change', authorizeToken, changeEmailController);
router.post('/verify', authorizeToken, verifyAuthorizedEmailController);

export default router;
