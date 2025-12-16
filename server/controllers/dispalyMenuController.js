import asyncHandler from "express-async-handler";
import Hotel from "../models/Hotel.js";
import Menu from "../models/Menu.js";

const displayMenu = asyncHandler( async (req,res) => {
    const hotelId = req.params.hotelId;
    if(!hotelId){
        res.status(400);
        throw new Error("Hotel Id is not provided");
    }

    const hotel = await Hotel.findById(hotelId);
    if(!hotel){
        res.status(404);
        throw new Error("Hotel not found");
    }

    const menuList = await Menu.find({hotel:hotelId});
    
    res.status(200).json({
        success: true,
        message:"Menu list from the hotel",
        hotel: {
            id: hotel._id,
            hotelname: hotel.hotelname
        },
        menuList});
});

export { displayMenu };