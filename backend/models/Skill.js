const mongoose = require('mongoose');

const skillItemSchema = new mongoose.Schema({
  name: String,
  level: { type: Number, min: 0, max: 100 }
});

const skillSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    icon: String,
    items: [skillItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
