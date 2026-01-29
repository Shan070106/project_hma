import Router from 'express';
import { createMenu, getMenuList, getMenu, updateMenu, deleteMenu } from '../controllers/menuController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { displayMenu } from '../controllers/dispalyMenuController.js';

const router = Router();

router.post('/create',requireAuth, createMenu);
router.get('/list',requireAuth, getMenuList);
router.get('/:id',requireAuth,getMenu);
router.put('/:id',requireAuth, updateMenu);
router.delete('/:id',requireAuth, deleteMenu);
router.get('/hotel/:hotelId',displayMenu);

export default router;

/* This file defines routes for menu-related operations, including creating, retrieving, updating, and deleting menu items. 
   Each route is protected by the requireAuth middleware to ensure that only authenticated users can access these endpoints. 
   The corresponding controller functions handle the business logic for each operation. */