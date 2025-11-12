import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
    {
    hotelname: { type: String, required: true, trim: true },
    address: { type: String, required: true, unique: true, trim: true },
    rating: { type: Number, required: false,default:0, min: 0, max: 5},
    description: { type: String, required: false, trim: true },
    menu: [{
            type: mongoose.Schema.Types.ObjectId, ref: "MenuItem"
        },],
  },
  { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);