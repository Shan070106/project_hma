// Importing Hotel model
import Hotel from "../models/Hotel.js";
import asyncHandler from "express-async-handler";

const hotelController = {
    getHotel: asyncHandler(async (req, res) => {
        const hotel = await Hotel.findById(req.params.id);
        return res.json(hotel);
    }),
};

export default hotelController;