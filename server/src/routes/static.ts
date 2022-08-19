import express, {Router} from 'express';
import { gamePath } from '../paths';

const router = Router();

router.use('/scripts', express.static(`${gamePath}/dist`));
router.use('/data', express.static(`${gamePath}/data`));
router.use('/assets', express.static(`${gamePath}/assets`));
router.use('/', express.static(`${gamePath}/web`));

export default router;