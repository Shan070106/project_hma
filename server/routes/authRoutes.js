import {Router} from "express";
import {login,signup,me} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login",login);
router.post("/signup",signup);
router.get("/me",requireAuth,me);

export default router;