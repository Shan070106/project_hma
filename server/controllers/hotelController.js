// Importing Hotel model
import User from "../models/User.js";
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

const deleteHotel = asyncHandler( async (req,res) => {
    const userId = req.user.id;
    if(!userId){
        res.status(401);
        throw new Error("Not authenticated");
    }

    const hotel = await Hotel.findOne({owner: userId});
    if(!hotel){
        res.status(404);
        throw new Error("Hotel not found");
    }

    await hotel.remove();
    res.status(200).json({message: "Hotel deleted successfully"});
});

const createHotel = asyncHandler(async (req,res) => {
    const userId = req.user.id;
    
    const hotelExists = await Hotel.findOne({owner: userId});
    if(hotelExists){
        const err = res.status(400).json({message: "User already exists"});
        throw err;
    }
    
    const {hotelname, address,rating, description, menu, owner} = req.body; 

    if(!owner || !hotelname || !address){
        res.status(400);
        throw Error("GIve valid data");
    }

    const hotel = await Hotel.create({
        hotelname,
        address,
        rating,
        description,
        menu,
        user : owner
    });

    res.status(201).json({
        message: "Hotel createed successfully",
        hotel
    });
    
});

export {createHotel, getHotel, updateHotel, deleteHotel};