import { Router } from "express";

import staticRouter from "./static";
import mapsRouter from "./maps";
import usersRouter from './users';

import statsRouter from "./stats";
import { tokenHandler } from "../middlewares/token";

const router = Router();

router.use('/stats', tokenHandler, statsRouter);
router.use('/users', usersRouter);
//router.use(mapsRouter);
//router.use(staticRouter);

export default router;