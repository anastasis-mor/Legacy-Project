const User = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');
const { get } = require('mongoose');

// Register a user

const registerUser = async (req, res) => {
    // Validate the data before creating a user
    // const { error } = registerValidation(req.body);
    // if (error) {
    //     return res.status(400).send(error);
    // }

    // Check if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).send('Email already exists');
    }

    // Hash the password
    const saltRounds = Number(process.env.SALT_ROUNDS);
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (error) {
        res.status(400).send(error);
    }
}

// Login a user

const loginUser = async (req, res) => {
    // Validate the data before logging in a user
    // const { error } = loginValidation(req.body);
    // if (error) {
    //     return res.status(400).send(error);
    // }

    // Check if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Email is not found');
    }

    // Check if the password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(400).send('Invalid password');
    }

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
}

    // Update the user information
    
    const updateUser = async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            if (updates.password) {
                const saltRounds = Number(process.env.SALT_ROUNDS);
                const salt = await bcrypt.genSalt(saltRounds);
                updates.password = await bcrypt.hash(updates.password, salt);
            }
            const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
            res.status(200).json(updatedUser);
        }catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    const getUserById = async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.send(user);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });       
        }
    }

    // Upload profile picture
    const uploadProfilePicture = async (req, res) => {
        try {
            const { profilePicture } = req.body;
            
            if (!profilePicture) {
                return res.status(400).json({ message: "No image provided" });
            }
            
            // Update user with base64 image string
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                { profilePicture },
                { new: true }
            );
            
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            
            res.status(200).json({ 
                message: "Profile picture uploaded successfully",
                profilePicture
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        };
module.exports = { registerUser, loginUser, getUserById, updateUser,uploadProfilePicture };