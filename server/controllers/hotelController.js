// Importing Hotel model
import Hotel from "../models/Hotel.js";
import asyncHandler from "express-async-handler";

const getHotel = asyncHandler( async (req,res) => {
    const hotelId = req.params.id;
    try {
        const hotel = await Hotel.findById(hotelId);
        if(!hotel){
            throw new Error("Hotel not found");
        }
        res.status(200).json(hotel);
    } 
    catch (error) {
        res.status(404);
        throw new Error("Hotel not found");
    }

});

const updateHotel = asyncHandler(async (req,res) => {
    const hotelId = req.params.id;
    const update = req.body;
    try {
        const hotel = await Hotel.findById(hotelId);
        hotel.updateOne(update);
        res.status(200).json({message: "Hotel updated successfully"});
    } catch (error) {
        res.status(400);
        throw new Error("Failed to update hotel");
    }
});

export {getHotel, updateHotel};