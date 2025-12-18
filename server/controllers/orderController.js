import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Menu from "../models/Menu.js";

const createOrder = asyncHandler(async(req,res) => {

    const hotelId = req.params.hotelId;
    if(!hotelId){
        res.status(400);
        throw new Error("Hotel id is not found");
    }

    const {session,table} = req.query;

    const orders = req.body;
    console.log(orders);
    if(!Array.isArray(orders) || orders.length === 0){
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

export default {createOrder};