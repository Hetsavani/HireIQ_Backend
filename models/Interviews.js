const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  type: String,
  role: String,
  level: String,
  techstack: [String],
  amount: Number,
  userid: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  questions: [String]
});

module.exports = mongoose.model('Interview', interviewSchema);
