import { Router } from "express";
import { getUserHandler } from "../controllers/users/get";
import LoginHandler from "../controllers/users/login";
import HandlerRegister from "../controllers/users/register";
import { tokenHandler } from "../middlewares/token";

const router = Router();

router.post('/register', HandlerRegister.init);
router.post('/logout', LoginHandler.finish);
router.post('/login', LoginHandler.init);
router.get('/', tokenHandler, getUserHandler);

export default router;