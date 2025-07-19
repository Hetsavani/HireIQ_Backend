const User = require('../models/User');

exports.getUserById = async (req, res) => {
  try {
    const userId = req.user._id;
    // Validate ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Get User Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, about, imageUrl, resumeUrl, GeminiKey } = req.body;

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (about) updatedFields.about = about;
    if (imageUrl) updatedFields.imageUrl = imageUrl;
    if (resumeUrl) updatedFields.resumeUrl = resumeUrl;
    if (GeminiKey) updatedFields.geminiKey = GeminiKey;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select('-password -otpCode -otpExpiry');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// exports.updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id; // from verifyToken
//     const { name, imageUrl, GeminiKey } = req.body;
//     console.log(req.user)
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: { name, imageUrl, GeminiKey } },
//       { new: true }
//     ).select('-passwordHash');

//     if (!updatedUser) return res.status(404).json({ error: "User not found" });

//     res.status(200).json({ message: "Profile updated", user: updatedUser });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

