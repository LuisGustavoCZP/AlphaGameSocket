import { Router } from "express";
import { historyController } from "../controllers";
import { tokenHandler } from "../middlewares/token";

const router = Router();
router.get('/history', historyController);

export default router;