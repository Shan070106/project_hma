import bcrypt from "bcryptjs";
import asynchandler from "express-async-handler";

import signinToken from "../utils/generateToken.js";

import User from "../models/User.js";

const signup = asynchandler(async (res,req) => {

    if(!req.body || Object.keys(req.body).length === 0){
        return res.status(400).json({
          message: "Request body is missing, Ensure Content-Type: application/json is set."
        });    
    }

    const {username,email,password} = req.body;
    
    if(!username || !email || !password){
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const userExists = await User.findOne({
      $or : [{email},{username}]
    });
    
    if(userExists){
        return res.status(400).json({
          message: "User already exists, try to give different username or email"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user  = await User.create({
      username,
      email,
      password : hashedPassword
    });

    return res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      tokenId: signinToken(user._id)
    });

});

const login = asynchandler( async (req,res) => {
   
  if(!req.body || Object.keys(req.body).length === 0){
      return res.status(400).json({
        message: "Request body is missing, Ensure Content-Type: application/json is set"        
      });
   }

   const {username, password} =  req.body;

   if(!username || !password){
    return res.status(400).json({
      message: "Both fields are required"
    });
   }

   const user = await User.findOne({username});
   if(!user){
      return res.status(404).json({
        message: "Username not found"
      });
   }

   const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch){
      return res.status(401).json({
        message: "Wrong password"
      });
   }
   
  return res.status(200).json({
    user: {
      id: user._id,
      email: user.email,
      username: user.username 
    },
    tokenId: signinToken(user._id) 
  });
  
});

const me = asynchandler(async (req,res) => {
    
  return res.status(200).json({
    user: req.user
  });

});

export {signup, login, me};