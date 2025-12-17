import mongoose from "mongoose";

const orderSchema  = new mongoose.Schema(
    {
        hotel : 
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Hotel", 
                required: true
            },

        menuItems :{
            type: [
                {
                    menuItem : { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true},
                    name : {type: String, required: true},
                    price : {type: Number, required: true},
                    quantity : {type: Number, required: true, default: 1},
                }
            ],
            validate: [arr => arr.length > 0, "At least one menu item is required"]
        },

        totalAmount : { type: Number, required: true },
        sessionId : { type: String, required: true },
        status : { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
        tableId : { type: String, required: true },

        expires : { type: Date, required: true, index: { expires: 0 } }       
    },

    { timestamps: true }
);

orderSchema.index({
    hotel: 1, 
    status: 1
});

export default mongoose.model("Order", orderSchema);