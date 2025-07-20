// routes/quiz.routes.js

const express = require('express');
const router = express.Router();
const { createQuiz, joinQuiz, getAllQuizzes, updateQuizQuestions } = require('../controllers/quiz.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/quizzes', verifyToken, getAllQuizzes);
router.post('/create', verifyToken, createQuiz);
router.get('/join/:quizId', verifyToken, joinQuiz);
router.get('/quizzes', verifyToken, getAllQuizzes);
router.post('/update-questions/:quizId', verifyToken, updateQuizQuestions);
module.exports = router;
