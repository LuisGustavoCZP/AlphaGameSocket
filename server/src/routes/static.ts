import express, {Router} from 'express';
import { gamePath, clientPath } from '../utils/paths';

const router = Router();

router.use('/assets', express.static(`${gamePath}/maps`));
router.use('/game/scripts', express.static(`${gamePath}/dist`));
router.use('/data', express.static(`${gamePath}/data`));
router.use('/assets', express.static(`${gamePath}/assets`));
router.use('/', express.static(`${clientPath}/dist`));

export default router;