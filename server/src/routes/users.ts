import { Router } from "express";
import LoginHandler from "../controllers/users/login";
import HandlerRegister from "../controllers/users/register";

const router = Router();

router.post('/users/register', HandlerRegister.init);
router.post('/users/login', LoginHandler.init);

export default router;