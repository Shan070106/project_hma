import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
    {
        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true
        },
        tableNumber: {
            type: String,
            required: true,
            trim: true
        },
        tableCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            immutable: true
        },
        qrData: {
            type: String,
            required: true
        },
        qrImagePath: {
            type: String
        },
        qrVersion: {
            type: Number,
            default: 1
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

tableSchema.index({ hotel: 1, tableNumber: 1, isActive: 1 });
tableSchema.index(
    { hotel: 1, tableNumber: 1 },
    {
        unique: true,
        partialFilterExpression: { isActive: true }
    }
);

export default mongoose.model("Table", tableSchema);
