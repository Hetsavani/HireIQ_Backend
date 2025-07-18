// models/Quiz.js

const mongoose = require('mongoose');
const {questionSchema} = require('./Question');

// const quizSchema = new mongoose.Schema({
//     title: String,
//     quizId: String,
//     description: String,
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     questions: [
//         {
//             questionId: Number,
//             type: String,
//             questionText: String,
//             options: [String],
//             correctAnswer: String,
//             topic: String,
//             difficulty: String
//         }
//     ],
//     timeLimit: Number,
//     requiredPercentage: Number,
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });
// const questionSchema = new mongoose.Schema({
//   questionId: Number,
//   type: {
//     type: String,
//     enum: ['mcq', 'code', 'short'],
//     required: true
//   },
//   questionText: String,
//   options: [String], // optional for non-mcq
//   correctAnswer: String,
//   topic: String,
//   difficulty: {
//     type: String,
//     enum: ['easy', 'medium', 'hard']
//   }
// });

const quizSchema = new mongoose.Schema({
  title: String,
  quizId: String,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [questionSchema], // ✅ Fix here
  timeLimit: Number,
  requiredPercentage: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema);