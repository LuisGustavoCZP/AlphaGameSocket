import express, {Router} from 'express';
import { serverPath, clientPath } from '../utils/paths';

const router = Router();

/* router.use('/assets', express.static(`${serverPath}/assets`)); */
router.use('/game', express.static(`${clientPath}/game`));
router.use('/assets', express.static(`${clientPath}/src/assets`));
router.use('/sprites', express.static(`${clientPath}/sprites`));
router.use('/', express.static(`${clientPath}/dist`));

export default router;