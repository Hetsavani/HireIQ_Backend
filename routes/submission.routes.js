const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');

router.post('/submit', submissionController.createSubmission);
router.get('/user/:userId', submissionController.getSubmissionsByUser);

module.exports = router;
