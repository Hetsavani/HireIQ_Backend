const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  college:{
    type: String,
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'candidate'],
    required: true
  },
  geminiKey: {
    type: String
  },
  imageUrl: {
    type: String,
    default: '' // Default empty if not uploaded
  },
  resumeUrl: {
    type: String,
    default: '' // Default empty if not uploaded
  },
  about: {
    type: String,
    default: '' // Bio/summary about the user
  },
  otpCode: {
    type: String
  },
  otpExpiry: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
