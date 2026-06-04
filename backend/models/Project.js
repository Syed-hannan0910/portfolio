const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    description: { type: String, required: true },
    longDescription: String,
    tags: [String],
    github: String,
    live: String,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    color: { type: String, default: '#3B82F6' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
