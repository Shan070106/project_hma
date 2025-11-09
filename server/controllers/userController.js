import asynchandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

/* generate token whenever user signup or login sent back to user as response 
   then when user sends any number of requests it will carry this token
   this token is compared and verified in middleware/authMiddleware.js */
const generateToken = (id) => {
    return jwt.sign( {id}, process.env.JWT_SECRET_KEY, {expiresIn : "1d"});
}

// Creating user
// @route POST /api/user/signup
const signup = asynchandler(async (req, res) => {
    const {username, email, password} = req.body;

    // Validating user data provided by user to sign up
    if(!username || !email || !password){
        res.status(400);
        throw new Error("Fill all the fields");
    }

    // Checking if user already exists or not
    const userExists = await User.findOne({email,username});
    if(userExists){
        res.status(400);
        throw new Error("User already exists ");
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
        res.status(400);
        throw new Error("Userdata is not valid or user creation failed");
    }
});

// User login 
// @ route POST /api/user/login
const login = asynchandler(async (req,res) => {
    const {email, password} = req.body;
    console.log("Email,password " + email,password);

    const user = await User.findOne({email});
    console.log("User found : " + user);

    if(user && (await bcrypt.compare(password,user.password))){
        console.log("Password matched");
        res.status(201).json({
            _id : user._id,
            username : user.username,
            email : user.email,
            token : generateToken(user._id)
        })
    }
    else{
        console.log("Invalid credentials");
        res.status(400);
        throw new Error("Invalid credentials or password");
    }
});

// Reading user details
// @ route GET/api/user/:id 
const getUser = asynchandler(async (req,res) => {
    const user = await User.findById(req.user.id).select("-password");

    if(user){
        res.json(user);
    }
    else{
        res.status(404);
        throw new Error("User not foudn or retrieval failed");
    }
});

// Updating user details

const updateUser = asynchandler(async (req,res) => {
    /* data to be updated only extracted otherwise it will be 'undefined' */
    const {new_username, new_email, new_password } = req.body;

    const user = await User.findById(req.body.id);

    if(user){

        // Updating user details
        /* new data come through request, so we extracting data from requests
           data to be updated only be in requests */

        user.username = new_username || user.username;
        user.email = new_email || user.email;
        if(new_password){
            const uppu = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(new_password, uppu);
        }

        const updatedUser = await user.save();

        res.json({
            _id       : updatedUser._id,
            _username : updatedUser.username,
            _email    : updatedUser.email,
            token     : generateToken(updatedUser._id)
        });

    }
    else{
        res.status(404);
        throw new Error("User not found or updation failed");
    }
});

// Deleting user
// @ route DELETE /api/user/:id
const deleteUser = asynchandler(async (req,res) => {
    const user = await User.findById(req.user.id);

    if(user){
        await user.deleteOne(user.id);
        res.json({"User deleted successfully" : true});
    }
    else{
        res.status(404);
        throw new Error("Invalid user to delete or deletion failed");
    }
});

export {signup, login, getUser,updateUser, deleteUser};