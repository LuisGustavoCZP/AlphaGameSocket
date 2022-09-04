import express, {Router} from 'express';
import { serverPath, clientPath } from '../utils/paths';

const router = Router();

router.use('/assets', express.static(`../assets/`));
router.use('/game/', express.static(`${clientPath}/game`));
router.use('/data', express.static(`${clientPath}/data`));
router.use('/sprites', express.static(`${clientPath}/sprites`));
router.use('/', express.static(`${clientPath}/dist`));

export default router;