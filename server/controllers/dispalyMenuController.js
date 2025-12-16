import asyncHandler from "express-async-handler";
import Hotel from "../models/Hotel.js";
import Menu from "../models/Menu.js";

const displayMenu = asyncHandler( async (req,res) => {
    const hotelId = req.params.hotelId;
    if(!hotelId){
        res.status(400);
        throw new Error("Hotel Id is not provided");
    }
    const menuList = await Menu.find({hotel:hotelId});
    res.status(200).json({message:"Menu list from the hotel",menuList});
});

export { displayMenu };