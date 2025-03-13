const express = require('express');
const router = express.Router();
const { getAllChats, createChat, updateChat, deleteChat } = require('../controllers/chatControllers');
const authenticate = require('../middleWare/auth');

router.get('/', getAllChats);
router.post('/create',authenticate, createChat);
router.put('/update/:id', updateChat);
router.delete('/delete/:id', deleteChat);


module.exports = router;
// Compare this snippet from models/chatModel.js: 
