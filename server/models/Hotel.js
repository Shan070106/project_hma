import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema();

export default mongoose.model("Hotel", hotelSchema);