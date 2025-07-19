// routes/quiz.routes.js

const express = require('express');
const router = express.Router();
const { createQuiz, joinQuiz, getAllQuizzes } = require('../controllers/quiz.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/create', verifyToken, createQuiz);
router.get('/join/:quizId', verifyToken, joinQuiz);
router.get('/quizzes', verifyToken, getAllQuizzes);


module.exports = router;
