const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedAnswer: { type: String, required: true },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
});

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: String, required: true, ref: "Quiz" },
  responses: [responseSchema],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  startedAt: { type: Date, required: true },
  submittedAt: { type: Date, required: true },
  eligibility: { type: String, enum: ['Eligible', 'Not Eligible'], required: true }
});

module.exports = mongoose.model('Submission', submissionSchema);
