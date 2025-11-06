import { logoutController } from "@/controllers/auth/logoutController";
import { Router } from "express";

const router = Router();

router.post('/', logoutController)

export default router;