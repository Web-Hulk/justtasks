import { Router } from 'express';
import { deleteUserController } from '../../controllers/rbac/users/deleteUserController.js';
import { updateUserController } from '../../controllers/rbac/users/updateUserController.js';
import { userController } from '../../controllers/rbac/users/userController.js';
import { usersController } from '../../controllers/rbac/users/usersController.js';
import { authorizeToken } from '../../middlewares/authorizeToken.js';
import { checkPermissions } from '../../middlewares/checkPermissions.js';

const router = Router();

router.get('/', authorizeToken, checkPermissions, usersController);
router.put('/:id/role', authorizeToken, checkPermissions, updateUserController);
router.get('/:id', authorizeToken, checkPermissions, userController);
router.delete('/:id', authorizeToken, checkPermissions, deleteUserController);

export default router;
