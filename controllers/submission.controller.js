const Submission = require('../models/Submission');

exports.createSubmission = async (req, res) => {
  try {
    const {
      userId,
      quizId,
      responses,
      score,
      totalQuestions,
      percentage,
      startedAt,
      submittedAt,
      eligibility
    } = req.body;

    const newSubmission = new Submission({
      userId,
      quizId,
      responses,
      score,
      totalQuestions,
      percentage,
      startedAt,
      submittedAt,
      eligibility
    });

    const saved = await newSubmission.save();
    res.status(201).json({ message: 'Submission saved successfully', data: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSubmissionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const submissions = await Submission.find({ userId }).populate('quizId').sort({ submittedAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};
