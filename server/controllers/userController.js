import asynchandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

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

const updateUser = asynchandler(async (req,res) => {
    const {username, email, password } = req.body;

    const user = await User.findById(req.user.id);

    if(user){
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

export {getUser, updateUser, deleteUser};