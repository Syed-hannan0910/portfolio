const connectDB = require('../config/db');
const Skill     = require('../models/Skill');

exports.getAllSkills = async (req, res) => {
  try {
    await connectDB();
    const skills = await Skill.find().lean();
    res.json({ success: true, data: skills });
  } catch (err) {
    console.error('[skillController]', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
