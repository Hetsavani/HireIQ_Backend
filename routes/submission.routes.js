const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/submit', submissionController.createSubmission);
router.get('/user/:userId', submissionController.getSubmissionsByUser);
router.get('/leaderboard/:quizId', submissionController.getLeaderboardByQuiz);
router.get('/previous-quizzes', verifyToken, submissionController.getPreviousQuizzesByUser);
// router.get('/quiz/:quizId', submissionController.getSubmissionsByQuiz);


module.exports = router;
