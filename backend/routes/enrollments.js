const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const { protect } = require("../middleware/auth");

// GET /api/enrollments — get current student's enrollments
router.get("/", protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.student._id,
      status: "enrolled",
    }).populate("course");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/enrollments — enroll in a course
router.post("/", protect, async (req, res) => {
  const { courseId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ message: "Course is full" });
    }

    const existing = await Enrollment.findOne({
      student: req.student._id,
      course: courseId,
      status: "enrolled",
    });
    if (existing) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      student: req.student._id,
      course: courseId,
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { enrolled: 1 } });

    const populated = await enrollment.populate("course");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/enrollments/:id — drop a course
router.delete("/:id", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.student._id,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    enrollment.status = "dropped";
    await enrollment.save();
    await Course.findByIdAndUpdate(enrollment.course, { $inc: { enrolled: -1 } });

    res.json({ message: "Course dropped successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
