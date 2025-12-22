import Router from 'express';
import {createOrder,customerOrders,getCustomerOrder} from "../controllers/orderController.js";

const router = Router();

router.post('/hotelId:',createOrder);
router.get('/hotelId:/session/sessionId:',getCustomerOrder);
router.get('/hotel/all',requireAuth,customerOrders);


export default router;