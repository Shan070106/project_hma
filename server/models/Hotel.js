import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
    {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: false, trim: true },
    images: [ {
                url: { type: String, required: false } ,
                publicId: { type: String, required: false}
              }
            ],
    address: { type: String, required: true, unique: true, trim: true },
    city: {type: String, required: true, trim: true},
    state: {type: String,required: true, trim: true},
    country: {type: String, required: true, trim: true},
    pincode: {type: String, required: true, max: 6},
    phone: {type: String, required: true, trim: true},
    email: {type: String, required:true, unique: true, lowercase: true, trim: true},
    rating: { type: Number, required: false,default:0, min: 0, max: 5},
    menu: [
            { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem"},
          ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true} 
  },
  { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);