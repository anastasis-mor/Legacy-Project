const express = require('express');
const router = express.Router();
const { registerUser, loginUser , getUserById, updateUser,uploadProfilePicture} = require('../controllers/userControllers');
const authenticate = require('../middleWare/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.post('/profile-picture', authenticate, uploadProfilePicture);
module.exports = router;