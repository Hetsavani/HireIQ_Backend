const express = require("express");
const router = express.Router();
const {
  updateProfile,
  getUserById,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/authMiddleware");
const quizController = require('../controllers/quiz.controller');

router.put("/update-profile", verifyToken, updateProfile);
router.get("/profile",verifyToken, getUserById);
router.get('/quizzes/admin/:adminId', verifyToken,quizController.getQuizzesByAdmin);

module.exports = router;
