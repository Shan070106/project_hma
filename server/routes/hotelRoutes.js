import Router from "express";

// Import controller functions
import { createHotel, retrieveHotel, updateHotel, deleteHotel } from "../controllers/hotelController.js";

// Import authentication middleware
import  requireAuth  from "../middleware/authMiddleware.js";

const router = Router();

router.post("/create",requireAuth, createHotel);
router.get("/me",requireAuth, retrieveHotel);
router.put("/me",requireAuth,updateHotel);
router.delete("/me",requireAuth,deleteHotel);

export default router;

/* This file defines routes for hotel-related operations, including getting, updating, and deleting hotel information. 
   Each route is protected by the requireAuth middleware to ensure that only authenticated users can access these endpoints. 
   The corresponding controller functions handle the business logic for each operation. */