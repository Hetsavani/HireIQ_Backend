// models/Quiz.js

const mongoose = require("mongoose");
const { questionSchema } = require("./Question");

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
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questions: [questionSchema], // ✅ Fix here
  timeLimit: Number,
  requiredPercentage: Number,
  image: { type: String }, // ✅ New field
  difficulty: { type: String, enum: ["easy", "medium", "hard"] }, // ✅ New field
  category: { type: String }, // ✅ New field
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// const quizSchema = new mongoose.Schema({
//   quizId: { type: String, required: true, unique: true },
//   title: { type: String, required: true },
//   description: String,
//   image: { type: String }, // ✅ New field
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   questions: [questionSchema],
//   timeLimit: Number, // in minutes
//   requiredPercentage: Number
// }, { timestamps: true });
// module.exports = mongoose.model('Quiz', quizSchema);
