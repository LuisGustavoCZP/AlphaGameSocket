import { Router } from "express";

import staticRouter from "./static";
import mapsRouter from "./maps";
import usersRouter from './users';

import { historyController } from "../controllers";
import { tokenHandler } from "../middlewares/token";

const router = Router();

router.use('/stats', tokenHandler, historyController);
router.use('/users', usersRouter);
router.use(mapsRouter);
router.use(staticRouter);

export default router;