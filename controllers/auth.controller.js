// controllers/auth.controller.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["admin", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash: hashed,
      role,
      GeminiKey: role === "admin" ? req.body.GeminiKey : null,
      profileImage: req.body.profileImage || null,
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    next(err);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    console.log(email, password, role);
    const user = await User.findOne({ email, role });
    console.log(user);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};
const sendOTP = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Save to DB
    user.otpCode = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"QuizBot" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your OTP Code for Password Reset",
      html: `<h2>Your OTP Code</h2><p>${otp}</p><p>This code expires in 10 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    next(err);
  }
};

const verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  console.log(otp);
  console.log(email);
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user || String(user.otpCode) !== String(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ error: "OTP expired" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    next(err);
  }
};
const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otpCode !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, register, sendOTP, verifyOTP, resetPassword };
