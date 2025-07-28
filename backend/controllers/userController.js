const User = require('../models/User');

// Create or update user profile
exports.createOrUpdateUser = async (req, res) => {
  const { uid, email } = req.user; // from auth middleware
  const { name } = req.body; // example extra field

  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { email, name },
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  const { uid } = req.user;
  try {
    const user = await User.findOne({ uid });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
