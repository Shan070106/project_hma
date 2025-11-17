
import express from "express";
import cors from "cors";
import morgs from "morgan";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { errorhandler } from "./middleware/errorhandler.js";

const app = express();

// Home route
app.get("/", (req, res) => {
  res.send("Hotel Menu App Home Page");
});

// Environment config
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgs("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/users/", userRoutes);

// Database connection
dbConnection();

// Error Handler Middleware
app.use(errorhandler);

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server began to run on 5000 port");
});

