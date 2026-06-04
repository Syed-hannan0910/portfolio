const connectDB = require('../config/db');
const Project   = require('../models/Project');

exports.getAllProjects = async (req, res) => {
  try {
    await connectDB();
    const filter   = req.query.featured === 'true' ? { featured: true } : {};
    const projects = await Project.find(filter).sort({ order: 1 }).lean();
    res.json({ success: true, data: projects, count: projects.length });
  } catch (err) {
    console.error('[projectController]', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    await connectDB();
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    console.error('[projectController]', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
