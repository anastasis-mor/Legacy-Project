const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: '',
    },
}, { timestamps: true });

// Export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;