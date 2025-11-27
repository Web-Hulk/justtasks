import { Router } from 'express';
import { meController } from '../controllers/me/meController.js';
import { meDeleteController } from '../controllers/me/meDeleteController.js';
import { meUpdateController } from '../controllers/me/meUpdateController.js';
import { authorizeToken } from '../middlewares/authorizeToken.js';

const router = Router();

router.get('/', authorizeToken, meController);
router.put('/', authorizeToken, meUpdateController);
router.delete('/', authorizeToken, meDeleteController);

export default router;
