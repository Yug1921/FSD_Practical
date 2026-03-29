const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: [true, "Course title is required"],
    },
    description: {
      type: String,
      default: "",
    },
    instructor: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    schedule: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 30,
    },
    enrolled: {
      type: Number,
      default: 0,
    },
    department: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
