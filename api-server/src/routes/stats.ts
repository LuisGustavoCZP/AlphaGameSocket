import { Router } from "express";
import { historyController } from "../controllers";
import { rankingController } from "../controllers";

const router = Router();

router.get('/history', historyController);
router.get('/ranking', rankingController);

export default router;