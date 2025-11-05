import { Router } from "express";
import { profileController } from "../controllers/profileController";
import { authorizeToken } from "../middlewares/authorizeToken";

const router = Router();

router.get('/', authorizeToken, profileController);

export default router;