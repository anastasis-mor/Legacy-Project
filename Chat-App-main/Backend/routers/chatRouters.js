const express = require('express');
const router = express.Router();
const { getAllChats, createChat, updateChat, deleteChat } = require('../controllers/chatControllers');

router.get('/', getAllChats);
router.post('/create', createChat);
router.put('/update/:id', updateChat);
router.delete('/delete/:id', deleteChat);

module.exports = router;
// Compare this snippet from models/chatModel.js: 
