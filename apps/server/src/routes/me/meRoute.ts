import { Router } from 'express';
import { meController } from '../../controllers/me/meController.js';
import { meDeleteController } from '../../controllers/me/meDeleteController.js';
import { meUpdateController } from '../../controllers/me/meUpdateController.js';
import { authorizeToken } from '../../middlewares/authorizeToken.js';
import { checkPermissions } from '../../middlewares/checkPermissions.js';

const router = Router();

router.get('/', authorizeToken, checkPermissions, meController);
router.put('/', authorizeToken, checkPermissions, meUpdateController);
router.delete('/', authorizeToken, checkPermissions, meDeleteController);

export default router;
