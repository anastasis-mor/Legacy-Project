const Chat = require('../models/chatModel');
const User = require('../models/userModels');

// Get all chats
const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find();
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a chat

const createChat = async (req, res) => {
    try {
        //  const token = req.header.authorization.split(" ")[1]; // Get the token from the header
        //  const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
        const user = await User.findById(req.user._id);  // Find the user by id from DB
        const newChat = await new Chat({
            message: req.body.message,
            sender: user.name,
            senderId: user._id, //store the user id of the sender
            image: req.body.image  
    });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

// Update a chat
const updateChat = async (req, res) => {
    try {
        const updateChat = await Chat.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        if (!updateChat) {
            res.status(404).json({ message: 'Chat not found' });
        }
        res.status(200).json(updateChat);
    } catch (error) {
        res.status(500).json({ message: error.message, Second: "At Update" });
    }
}

// Delete a chat

const deleteChat = async (req, res) => {
    try {
        const deleteChat = await Chat.findByIdAndDelete(req.params.id);
        if (!deleteChat) {
            res.status(404).json({ message: 'Chat not found' });
        }
        res.status(200).json({deleteChat, msg: 'Chat deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: error.message, Second: "At Delete" });
    }
}

module.exports = { getAllChats, createChat, updateChat, deleteChat };