import express from "express";
import dotenv from "dotenv";
import cors from "cors";          // cors full form -> Cross-Origin Resource Sharing middleware 
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

app.use(cors({origin: true, credentials: true}));
app.use(express.json());

//Data Base
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((e) => console.error("Error ",e.message));

// Routes
app.use("/api/auth",authRoutes);

// Global error handling
app.use((err,_req,res,_next) => {
    const status = err.status || 500;
    res.status(status).json({message : err.message || "server error"});
});

// app.get("/", (req, res) => {
//   res.send("Hotel Menu App Backend Running!");
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
