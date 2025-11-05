import { Router } from "express";
import { refreshController } from "../controllers/refreshController";

const router = Router();

router.post('/', refreshController);

export default router;