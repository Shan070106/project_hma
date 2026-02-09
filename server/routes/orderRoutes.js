import Router from 'express';
import {createOrder,customerOrders,getCustomerOrder,cancelOrder} from "../controllers/orderController.js";

const router = Router();

router.post('/:hotelId',createOrder);
router.get('/:hotelId/session/:sessionId/table/:tableId',getCustomerOrder);
router.patch('/:hotelId/session/:sessionId/table/:tableId/cancel',cancelOrder);
router.get('/hotel/all',customerOrders);

export default router;