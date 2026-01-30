import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
    {
        hotel: {type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true},
        name: {type: String, required: true, trim: true},
        description: {type: String, required: false, trim: true},
        amount: {type: Number, required: true, min: 0},
        rating: {type: Number, required: false, default: 0, min: 0, max: 5},
        image: {
                url: { type: String, required: true},
                publicId: { type: String, required: false}
            },
        recipe: {type: String, required: false, trim: true},
        avail: {type: Boolean, required: true,default: true}
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Menu",menuSchema);