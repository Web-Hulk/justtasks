import { Router } from 'express';
import { sessionDeleteController } from '../../../controllers/auth/session/sessionDeleteController.js';
import { sessionLogoutAllController } from '../../../controllers/auth/session/sessionLogoutAllController.js';
import { sessionsController } from '../../../controllers/auth/session/sessionsController.js';
import { authorizeToken } from '../../../middlewares/authorizeToken.js';

const router = Router();

router.get('/', authorizeToken, sessionsController);
router.post('/logout-all', authorizeToken, sessionLogoutAllController);
// router.put('/:sessionId', authorizeToken, sessionUpdateController);
router.delete('/:sessionId', authorizeToken, sessionDeleteController);

export default router;
