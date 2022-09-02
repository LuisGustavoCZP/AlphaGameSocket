import { Router } from "express";

import staticRouter from "./static";
import mapsRouter from "./maps";
import matchRouter from "./match";

const router = Router();

router.use(matchRouter);
router.use(mapsRouter);
router.use(staticRouter);

export default router;