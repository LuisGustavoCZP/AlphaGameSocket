import { Router } from "express";

import staticRouter from "./static";
import mapsRouter from "./maps";

const router = Router();

router.use(mapsRouter);
router.use(staticRouter);

export default router;