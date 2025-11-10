import asynchandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

/* generate token whenever user signup or login sent back to user as response 
   then when user sends any number of requests it will carry this token
   this token is compared and verified in middleware/authMiddleware.js */
const generateToken = (id) => {
    return jwt.sign( {id}, process.env.JWT_SECRET, {expiresIn : "1d"});
}

// Creating user
// @route POST /api/user/signup
const signup = asynchandler(async (req, res) => {
    // Defensive: ensure body is present to avoid destructuring from undefined
    if (!req.body || Object.keys(req.body).length === 0) {
        const err = new Error("Request body is missing or empty. Ensure 'Content-Type: application/json' header is set and a valid JSON body is sent.");
        err.status = 400;
        throw err;
    }

    // Helpful debug info while developing
    console.log("[signup] headers:", req.headers);
    console.log("[signup] body:", req.body);

    const {username, email, password} = req.body;

    // Validating user data provided by user to sign up
    if(!username || !email || !password){
        const err = new Error("Fill all the fields");
        err.status = 400;
        throw err;
    }

    // Checking if user already exists or not (either email OR username)
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if(userExists){
        const err = new Error("User already exists");
        err.status = 400;
        throw err;
    }

    // Hashing the password before storing it in database 
    /* Uppu potu maraikurom */
    const uppu = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,uppu); 
    
    // Creating user with given username, email and hashed password
    const user = await User.create({
        username,
        email,
        password : hashedPassword
    });

    if(user){
        res.status(201).json({
            _id : user._id,
            username : user.username,
            email : user.email,
            token : generateToken(user._id)
        });
        console.log("new user created"+user);
    }
    else{
        const err = new Error("Userdata is not valid or user creation failed");
        err.status = 400;
        throw err;
    }
});

// User login 
// @ route POST /api/user/login
const login = asynchandler(async (req,res) => {
    // Defensive: ensure body is present
    if (!req.body || Object.keys(req.body).length === 0) {
        const err = new Error("Request body is missing or empty. Ensure 'Content-Type: application/json' header is set and a valid JSON body is sent.");
        err.status = 400;
        throw err;
    }

    console.log("[login] headers:", req.headers);
    console.log("[login] body:", req.body);

    const {email, password} = req.body;

    const user = await User.findOne({email});
    console.log("User found : " + user);

    if(user && (await bcrypt.compare(password,user.password))){
        console.log("Password matched");
        res.status(200).json({
            _id : user._id,
            username : user.username,
            email : user.email,
            token : generateToken(user._id)
        })
    }
    else{
        console.log("Invalid credentials");
        const err = new Error("Invalid credentials or password");
        err.status = 400;
        throw err;
    }
});

// Reading user details
// @ route GET /api/user/me 
const getUser = asynchandler(async (req,res) => {
    const user = await User.findById(req.user.id).select("-password");

    if(user){
        res.json(user);
    }
    else{
        const err = new Error("User not found or retrieval failed");
        err.status = 404;
        throw err;
    }
});

// Updating user details

const updateUser = asynchandler(async (req,res) => {
    /* data to be updated only extracted otherwise it will be 'undefined' */
    const {username, email, password } = req.body;

    const user = await User.findById(req.user.id);

    if(user){

        // Updating user details
        /* new data come through request, so we extracting data from requests
           data to be updated only be in requests */

        user.username = username || user.username;
        user.email = email || user.email;
        if(password){
            const uppu = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, uppu);
        }

        const updatedUser = await user.save();

        res.json({
            _id       : updatedUser._id,
            username : updatedUser.username,
            email    : updatedUser.email,
            token     : generateToken(updatedUser._id)
        });

    }
    else{
        const err = new Error("User not found or updation failed");
        err.status = 404;
        throw err;
    }
});

// Deleting user
// @ route DELETE /api/user/:id
const deleteUser = asynchandler(async (req,res) => {
    const user = await User.findById(req.user.id);

    if(user){
        await user.deleteOne();
        res.json({ message: "User deleted successfully" });
    }
    else{
        const err = new Error("Invalid user to delete or deletion failed");
        err.status = 404;
        throw err;
    }
});

export {signup, login, getUser,updateUser, deleteUser};