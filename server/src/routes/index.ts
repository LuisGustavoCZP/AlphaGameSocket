import { Router } from "express";

import staticRouter from "./static";
import mapsRouter from "./maps";
import usersRouter from './users';

const router = Router();

router.use('/users', usersRouter);
router.use(mapsRouter);
router.use(staticRouter);

export default router;