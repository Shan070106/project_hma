import Routes from "express"

import {signup, login, getUser, updateUser, deleteUser} from "../controllers/userController.js";

import { requireAuth } from "../middleware/authMiddleware";

const router = Routes();

router.post("/signup",requireAuth, signup);
router.post("/login",requireAuth,login);
router.get("/:id", requireAuth, getUser);
// router.put("/:id", requireAuth, updateUser);
// router.delete("/:id", requireAuth, deleteUser);

export default router;