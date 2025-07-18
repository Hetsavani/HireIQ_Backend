const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyToken
    const { name, imageUrl, GeminiKey } = req.body;
    console.log(req.user)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { name, imageUrl, GeminiKey } },
      { new: true }
    ).select('-passwordHash');

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
