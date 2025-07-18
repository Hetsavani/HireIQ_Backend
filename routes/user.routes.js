const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

router.put('/update-profile', verifyToken, updateProfile);

module.exports = router;
