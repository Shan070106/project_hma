import Menu from "../models/Menu.js";
import Hotel from "../models/Hotel.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const createMenu = asyncHandler(async (req,res) => {
    const userId = req.userId;
    
    const hotel = await Hotel.findOne({user: userId});
    if(!hotel){
        res.status(404);
        throw new Error("Hotel not found or create hotel first");
    }

    const { hotelId,name, description, amount, rating, recipe } = req.body || {};
    if(!name || !amount || !hotelId){
        res.status(400);
        throw new Error("Please provide all required fields: name, amount, hotel");
    }

    if(!req.file){
        res.status(400);
        throw new Error("menu image is required");
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path,{ folder: "hotel/menu" });

    fs.unlinkSync(req.file.path);

    const menu = await Menu.create({
        hotel: hotelId,
        name: name,
        description: description,
        amount: amount,
        rating: rating,
        image: {
            url: uploadResult.secure_url,
            publicId: uploadResult.publicId
        },
        recipe: recipe,
    });
    res.status(201).json({ message:"Menu item created", menu });

});

const getMenuList = asyncHandler( async (req,res) => {
    const userId = req.userId;
    
    const hotel = await Hotel.findOne({user: userId});
    if(!hotel){
        res.status(404);
        throw new Error("Hotel not found");
    }

    const menuList = await Menu.find({hotel: hotel._id});
    res.status(200).json({message: "Menu list for the hotel", menuList});
});

const getMenu = asyncHandler(async (req,res) => {
    const userId = req.userId;

    const hotel = await Hotel.findOne({user: userId});
    if(!hotel){
        res.status(404);
        throw new Error("Hotel not found");
    }

    const menuId = req.params.menuId;
    const menu = await Menu.findOne({_id: menuId, hotel: hotel._id});
    if(!menu){
        res.status(404);
        throw new Error("Menu item not found");
    }

    res.status(200).json({message: "Menu item that was asked",menu});
});

const updateMenu = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const hotel = await Hotel.findOne({user: userId});
    if(!hotel){
        res.status(404);
        throw new Error("Hotel not found");
    }

    const menuId = req.params.menuId;
    const menu = await Menu.findOne({_id: menuId, hotel: hotel._id});
    if(!menu){
        res.status(404);
        throw new Error("Menu item not found");
    }
    
    const { name, description, amount, rating, recipe } = req.body || {};

    if(name) menu.name = name;
    if(description) menu.description = description;
    if(amount) menu.amount = amount;
    if(rating) menu.rating = rating;
    if(recipe) menu.recipe = recipe;

    if(req.file){
        if(menu.image?.publicId){
            await cloudinary.uploader.destroy(req.file.path, {folder: "hotel/menu"});
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {folder: "hotel/menu"});

        fs.unlinkSync(req.file.path);

        menu.image = {
            url: uploadResult.secure_url,
            publicId: uploadResult.publicId
        };
    }

    await menu.save();

    res.status(201).json({message:"Menu updated sucessfully", menu});
});

const deleteMenu = asyncHandler(async (req,res) => {
    const userId = req.userId;

    const hotel = await Hotel.findOne({user:userId});
    if(!hotel){
        res.status(404);
        throw new Error("Hotel not found");
    }

    const menuId = req.params.menuId;

    const menu = await Menu.findOne({_id: menuId,hotel:hotel._id});
    if(!menu){
        res.status(404);
        throw new Error("Selected menu not found ");
    }
    
    //deleting image first then deleting db row

    if(menu.image?.publicId){
        await cloudinary.uploader.destroy(menu.image.publicId, { folder: "hotel/menu" });
    }

    await menu.deleteOne();
    
    res.status(200).json({message: "Menu item deleted successfully"});
});

export { createMenu, getMenuList, getMenu, updateMenu, deleteMenu };