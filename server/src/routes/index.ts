import { Router } from "express";

import staticRouter from "./static";
import mapsRouter from "./maps";
import usersRouter from './users';

const router = Router();

router.use(mapsRouter);
router.use(staticRouter);
router.use(usersRouter);

export default router;