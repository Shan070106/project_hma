import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Menu from "../models/Menu.js";
import Hotel from "../models/Hotel.js";

// order controllers for public customers without authentication
const createOrder = asyncHandler(async(req,res) => {

    const hotelId = req.params.hotelId;
    if(!hotelId){
        res.status(400);
        throw new Error("Hotel id is not found");
    }

    const {session,table} = req.query;

    const orders = req.body;
    console.log(orders);
    if(!Array.isArray(orders) || orders.length == 0){
        res.status(400);
        throw new Error("ordered menus must be a non-empty array");
    }

    const menuIds = orders.map((menuItem) => menuItem._id);
    
    const menuItems = await Menu.find({
        _id: {$in: menuIds},
        avail: true,
        hotel: hotelId   
    });
    
    if(menuItems.length !== menuIds.length){
        res.status(400);
        throw new Error("One or more not valid for ordering");
    }
    
    let totalAmount = 0;

    const orderedItems = orders.map( order => { 
            const orderMenu = menuItems.find(
                menu => menu._id.toString() === order._id
            );

            const menuAmount =  orderMenu.amount * order.quantity;
            totalAmount += menuAmount;

            return {
                menuItem: orderMenu._id,
                name: orderMenu.name,
                price: orderMenu.amount,
                quantity: order.quantity
            };
    });
        
    const order = await Order.create({
        hotel: hotelId,
        menuItems: orderedItems,
        totalAmount,
        sessionId: session,
        status: "pending",
        tableId: table,
        expires: new Date(Date.now() + 3*60*60*1000)
    });
    
});

const getCustomerOrder = asyncHandler(async(req,res) => {
    const hotelId = req.params.hotelId;
    if(!hotelId){
        res.status(400);
        throw new Error("Hotel Id not found");
    }

    const {session, table} = req.query;
    if(!session || !table){
        res.status(400);
        throw new Error("Session ID and table id not found");
    }

    const order = await Order.find({
        hotel: hotelId,
        sessionId: session,
        tableId: table,
        status: {$in: ["pending", "confirmed"]},
        expires: {$gt: new Date()}
    })
    .sort({createdAt: -1}).populate("menuItems.menuItem","name price");
    
    if(order.length === 0){
        res.status(404);
        throw new Error("Orders not found");
    }

    res.status(200).json({
        success: true,
        message: "Customer orders",
        hotel: {
            id: hotelId,
            hotelname: hotel.hotelname
        },
        order
    });
});

const customerOrders = asyncHandler(async(req,res) => {
    const hotelId = req.params.hotelId;
    if(!hotelId){
        res.status(400);
        throw new Error("hotel id not found");
    }

    const hotel = await Hotel.findById(hotelId);
    if(!hotel){
        res.status(404);
        throw new Error("hotel not found");
    }

    const sessionId = req.query.sessionId;
    if(!sessionId){
        res.status(400);
        throw new Error("Session Id is required");
    }

    const orders = await Order.find({
        hotel: hotelId,
        sessionId,
        status: {$ne: "completed"},
        expires: {$gt: new Date()}
    }).sort({createdAt: -1});

    if(orders.length === 0){
        res.status(404);
        throw new Error("Customer ordered menu items not found");
    }

    res.status(200).json({
        success: true,
        message: "Customer ordered food items",
        hotel: {
            id: hotel._id,
            hotelname: hotel.hotelname
        },
        orders
    });
});



export default {createOrder,customerOrders,getCustomerOrder};


