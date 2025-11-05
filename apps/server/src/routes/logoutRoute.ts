import { Router } from "express";
import { logoutController } from "../controllers/logoutController";

const router = Router();

router.post('/', logoutController)

export default router;