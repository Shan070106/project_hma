// Middleware
// app.use(cors({ origin: true, credentials: true }));





// // Global Error Handler
// app.use((err, _req, res, _next) => {
//   const status = err.status || 500;
//   res.status(status).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });

// Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


import express from "express";
import cors from "cors";
import morgs from "morgan";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import {errorhandler} from "./middleware/errorhandler.js";

const app = express();

app.get("/",(req,res)=>{
  res.send("Hotel Menu App Home Page");
});

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(morgs('dev'));

//Routes
app.use("/api/auth",authRoutes);

dbConnection();

//Error Handler Middleware
app.use(errorhandler);

const PORT = 3000;
app.listen(PORT, ()=>{
  console.log("Server began to run on 3000 port");
});
