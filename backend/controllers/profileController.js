const connectDB = require('../config/db');
const Profile   = require('../models/Profile');

exports.getProfile = async (req, res) => {
  try {
    await connectDB();
    const profile = await Profile.findOne().lean();
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.json({ success: true, data: profile });
  } catch (err) {
    console.error('[profileController]', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
