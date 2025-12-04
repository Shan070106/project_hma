import Menu from "../models/Menu.js";
import Hotel from "../models/Hotel.js";
import asyncHandler from "express-async-handler";

const createMenu = asyncHandler(async (req,res) => {
    const userId = req.userId;
    
    const hotel = await Hotel.findOne({user: userId});
    if(!hotel){
        res.status(404);
        throw new Error("Hotel not found or create hotel first");
    }

    const { hotelId,name, description, amount, rating, image, recipe } = req.body || {};
    if(!name || !amount || !hotelId){
        res.status(400);
        throw new Error("Please provide all required fields: name, amount, hotel");
    }

    const menu = await Menu.create({
        hotel: hotelId,
        name: name,
        description: description,
        amount: amount,
        rating: rating,
        image: image,
        recipe: recipe,
    });
    res.status(201).json({ message:"Menu item created", menu });

});

const getMenuList = asyncHandler( async (req,res) => {

});

const getMenu = asyncHandler(async (req,res) => {
    const userId = req.userId;

    const hotel = await Hotel.findOne({user: userId});
    if(!hotel){
        res.status(404);
        throw new Error("Hotel not found");
    }

    const menuId = req.params.menuId;
    const menu = await Menu.findOne({id: menuId, hotel: hotel.id});
    if(!menu){
        res.status(404);
        throw new Error("Menu item not found");
    }

    res.status(200).json({message: "Menu item that was asked",menu});
});

const updateMenu = asyncHandler(async (req, res) => {

});

const deleteMenu = asyncHandler(async (req,res) => {

});

export { createMenu, getMenuList, getMenu, updateMenu, deleteMenu };