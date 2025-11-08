// Importing Hotel model
import Hotel from "../models/User.js";
import asyncHandler from "express-async-handler";
/* asyncHandler is used to handle exceptions in async functions 
   it catch the error, thrown to the async function and throw it to our global error handler 
   which is errorhandler.js */

const getHotel = asyncHandler( async (req,res) => {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);
    if(!hotel){
        res.status(404);
        throw new Error("Hotel not found");
    }
    res.status(200).json(hotel);
});

const updateHotel = asyncHandler(async (req,res) => {
    const hotelId = req.params.id;
    const update = req.body;
    const hotel = await Hotel.findById(hotelId);
    if(!hotel){
        res.status(404);
        throw new Error("Hotel not found");
    }
    hotel.name = update.name || hotel.name;
    hotel.email = update.email || hotel.email; 
});

export {getHotel, updateHotel};