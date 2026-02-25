import Router from "express"

import { getUser, updateUser, deleteUser} from "../controllers/userController.js";
import { signup, login } from "../controllers/authController.js";

import  requireAuth  from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, getUser);
router.put("/me", requireAuth, updateUser);
router.delete("/me", requireAuth, deleteUser);

export default router;