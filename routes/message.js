import express from 'express';
import {  getMessageByUser, getSupportMessage, sendMessage, sendSupportMessage } from '../controllers/messageController.js';
import { verifyAdmin, verifyToken } from '../utils/authenticate.js';

const router = express.Router();
router.get('/', verifyToken, verifyAdmin, getMessageByUser);
router.get('/support', verifyToken, getSupportMessage);
router.post('/', verifyToken, sendMessage);
router.post('/support', verifyToken, sendSupportMessage);

export default router;
