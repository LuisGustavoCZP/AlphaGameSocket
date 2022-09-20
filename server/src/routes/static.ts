import express, {Router} from 'express';
import { serverPath, clientPath } from '../utils/paths';

const router = Router();

router.use('/src/assets', express.static(`${clientPath}/src/assets`));
router.use('/game', express.static(`${clientPath}/game`));
router.use('/assets', express.static(`${clientPath}/src/assets`));
router.use('/sprites', express.static(`${clientPath}/sprites`));


router.use('/home', express.static(`${clientPath}/dist`));
router.use('/room', express.static(`${clientPath}/dist`));
router.use('/login', express.static(`${clientPath}/dist`));
router.use('/register', express.static(`${clientPath}/dist`));
router.use('/', express.static(`${clientPath}/dist`));

export default router;