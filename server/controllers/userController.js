import asynchandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt, { sign } from "jsonwebtoken";

import User from "../models/User.js";

/* generate token whenever user signup or login sent back to user as response 
   then when user sends any number of requests it will carry this token
   this token is compared and verified in middleware/authMiddleware.js */
const generateToken = (id) => {
    return jwt.sign( {id}, process.env.JWT_SECRET_KEY, {expiresIn : "1d"});
}

// Creating user
const signup = asynchandler(async (req, res) => {
    const {_username, _email, _password} = req.body;

    // Validating user data provided by user to sign up
    if(!_username || !_email || !_password){
        res.status(400);
        throw new Error("Fill all the fields");
    }

    // Checking if user already exists or not
    const userExists = User.findOne({_email,_username});
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
        username : _username,
        email    : _email,
        password : hashedPassword
    });

    if(user){
        res.status(201).json({
            _id : user._id,
            _username : user.username,
            _email : user.email,
            token : generateToken(user._id)
        });
    }
    else{
        res.status(400);
        throw new Error("Userdata is not valid or user creation failed");
    }
});

export {signup};