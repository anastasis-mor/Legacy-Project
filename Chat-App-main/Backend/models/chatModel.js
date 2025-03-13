const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId, // This is the user id of the sender , Store the user id of the sender
        ref: 'User', // This is the User model , Reference the User model
        required: true
    },
}, {timestamps: true});


const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;