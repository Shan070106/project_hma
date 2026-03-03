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

    res.status(200).json(hotel);
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

    hotel.name = update.name || hotel.name;
    hotel.address = update.address || hotel.address;
    hotel.rating = typeof update.rating !== "undefined" ? update.rating : hotel.rating;
    hotel.description = update.description || hotel.description;
    hotel.city = update.city || hotel.city;
    hotel.state = update.state || hotel.state;
    hotel.country = update.country || hotel.country;
    hotel.pincode = update.pincode || hotel.pincode;
    hotel.phone = update.phone || hotel.phone;
    hotel.email = update.email || hotel.email;
    if (update.menu) hotel.menu = update.menu;

    const updatedHotel = await hotel.save();
    res.status(200).json({
        success: true,
        message: "Successfully updated the hotel",
        data: updatedHotel
    });
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

    // Delete images from Cloudinary before deleting hotel
    if(hotel.images && hotel.images.length > 0){
        for(const image of hotel.images){
            if(image.publicId){
                // Note: Cloudinary integration removed
                console.log(`Would delete image: ${image.publicId}`);
            }
        }
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

    const { name, address, rating, description, menu, city, state, country, pincode, phone, email } = req.body || {};
    console.log(name,address,city,state,country,pincode,phone,email);
    if (!name || !address || !city || !state || !country || !pincode || !phone || !email) {
        res.status(400);
        throw new Error("Provide all required fields: name, address, city, state, country, pincode, phone, email");
    }   

    const hotel = await Hotel.create({
        name,
        address,
        rating,
        description,
        menu,
        city,
        state,
        country,
        pincode,
        phone,
        email,
        user: userId,
    });

    const err = new Error(JSON.stringify({
        message: "Hotel cerated succesffuly",
        hotel
    }));
    err.status = 201;
    console.log("printing error", err);
    throw err;
});

export { createHotel, retrieveHotel, updateHotel, deleteHotel };