import express from "express"

import {signup, login, getUser, updateUser, deleteUser} from "../controllers/userController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, getUser);
router.put("/me", requireAuth, updateUser);
router.delete("/me", requireAuth, deleteUser);

export default router;