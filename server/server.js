import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";

// dotenv.config();

const app = express();

// Middleware
// app.use(cors({ origin: true, credentials: true }));
// app.use(express.json());

// MongoDB Connection
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB connected successfully");
//   } catch (error) {
//     console.error("❌ MongoDB connection failed:", error.message);
//     process.exit(1); // Exit process if connection fails
//   }
// };
// connectDB();

// Routes
// app.use("/api/auth", authRoutes);

// Health Check Route (to verify backend is running)
app.get("/", (_req, res) => {
  res.send("Hotel Menu App API is running...");
});
app.use
// Global Error Handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

