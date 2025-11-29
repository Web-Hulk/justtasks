import { Router } from 'express';
import { rolesController } from '../../controllers/rbac/rolesController.js';
import { authorizeToken } from '../../middlewares/authorizeToken.js';
import { checkPermissions } from '../../middlewares/checkPermissions.js';

const router = Router();

router.get('/', authorizeToken, checkPermissions, rolesController);

export default router;
