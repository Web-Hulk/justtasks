import { Router } from "express";
import { refreshController } from "../../controllers/auth/refreshController";

const router = Router();

router.post('/', refreshController);

export default router;