const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,   // ✅ required (not require)
      minlength: 4,
      maxlength: 100,
      trim: true
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
