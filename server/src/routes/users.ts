import { Router } from "express";
import { getUserHandler } from "../controllers/users/get";
import LoginHandler from "../controllers/users/login";
import HandlerRegister from "../controllers/users/register";
import { tokenHandler } from "../middlewares/token";

const router = Router();

router.post('/register', HandlerRegister.init);
router.post('/login', LoginHandler.init);
router.get('/logout', tokenHandler, LoginHandler.finish);
router.get('/', tokenHandler, getUserHandler);

export default router;