// Importing Hotel model
import Hotel from "../models/Hotel.js";
import asyncHandler from "express-async-handler";
/* asyncHandler is used to handle exceptions in async functions 
   it catch the error, thrown to the async function and throw it to our global error handler 
   which is errorhandler.js */

/* asynchandler repalces the try/catch block */

// Get the authenticated user's hotel (route: GET /me)
const retrieveHotel = asyncHandler(async (req, res) => {
    console.log("Retrieved hotel: ", req);
    const userId = req.user.id;

    if (!userId) {
        const err = new Error("Not not authenticated");
        err.status = 401;
        throw err;
    }

    const hotel = await Hotel.findOne({ user: userId });
    if (!hotel) {
        const err = new Error("Hotel not found");
        err.status = 404;
        throw err;
    }

    const err = new Error(JSON.stringify(hotel));
    err.status = 200;
    throw err;
});

// Update the authenticated user's hotel (route: PUT /me)
const updateHotel = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        res.status(401);
        throw new Error("Not authenticated");
    }

    const update = req.body || {};
    const hotel = await Hotel.findOne({ user: userId });
    if (!hotel) {
        res.status(404);
        throw new Error("Hotel not found");
    }

    if (hotel.user.toString() !== userId) {
        res.status(403);
        throw new Error("Not authorized to update this hotel");
    }

    hotel.hotelname = update.hotelname || hotel.hotelname;
    hotel.address = update.address || hotel.address;
    hotel.rating = typeof update.rating !== "undefined" ? update.rating : hotel.rating;
    hotel.description = update.description || hotel.description;
    if (update.menu) hotel.menu = update.menu;

    const updatedHotel = await hotel.save();
    res.status(200);
    throw new Error(JSON.stringify(updatedHotel));
});

// Delete the authenticated user's hotel (route: DELETE /me)
const deleteHotel = asyncHandler(async (req, res) => {
   const userId = req.user.id;

    if (!userId) {
        res.status(401);
        throw new Error("Not authenticated");
    }

    const hotel = await Hotel.findOne({ user: userId });
    if (!hotel) {
        res.status(404);
        throw new Error("Hotel not found");
    }

    if (hotel.user.toString() !== userId) {
        res.status(403);
        throw new Error("Not authorized to delete this hotel");
    }

    await hotel.deleteOne();
    res.status(200);
    throw new Error(JSON.stringify({ message: "Hotel deleted successfully" }));
});

// Create a hotel for the authenticated user (route: POST /create)
const createHotel = asyncHandler(async (req, res) => {
    console.log("REqext: ", req);
    const userId = req.user.id;

    if (!userId) {
        res.status(401);
        throw new Error("Not noauthenticated");
    }

    const hotelExists = await Hotel.findOne({ user: userId });
    if (hotelExists) {
        res.status(400);
        throw new Error("Hotel already exists for this user");
    }

    const { hotelname, address, rating, description, menu } = req.body || {};
    if (!hotelname || !address) {
        res.status(400);
        throw new Error("Provide valid hotelname and address");
    }

    const hotel = await Hotel.create({
        hotelname,
        address,
        rating,
        description,
        menu,
        user: userId,
    });

    res.status(201);
    throw new Error(JSON.stringify({ message: "Hotel created successfully", hotel }));
});

export { createHotel, retrieveHotel, updateHotel, deleteHotel };