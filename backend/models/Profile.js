const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  location: String,
  grade: String,
  year: String
});

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: String,
    subtitle: String,
    bio: String,
    email: String,
    phone: String,
    location: String,
    github: String,
    linkedin: String,
    education: [educationSchema],
    interests: [String],
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
