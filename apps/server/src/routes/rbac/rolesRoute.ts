import { Router } from 'express';
import { rolesController } from '../../controllers/rbac/rolesController.js';
import { authorizeToken } from '../../middlewares/authorizeToken.js';
import { checkPermissions } from '../../middlewares/checkPermissions.js';
import { Role } from '../../types/types.js';

const router = Router();

router.get('/', authorizeToken, checkPermissions([Role.ADMIN]), rolesController);

export default router;
