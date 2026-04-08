const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const { protect } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

// GET /api/enrollments — get current student's enrollments
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find({
      student: req.student._id,
      status: "enrolled",
    }).populate("course");
    res.json(enrollments);
  })
);

// POST /api/enrollments — enroll in a course
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
  const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    if (course.enrolled >= course.capacity) {
      res.status(400);
      throw new Error("Course is full");
    }

    const existing = await Enrollment.findOne({
      student: req.student._id,
      course: courseId,
      status: "enrolled",
    });
    if (existing) {
      res.status(400);
      throw new Error("Already enrolled in this course");
    }

    const enrollment = await Enrollment.create({
      student: req.student._id,
      course: courseId,
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { enrolled: 1 } });

    const populated = await enrollment.populate("course");
    res.status(201).json(populated);
  })
);

// DELETE /api/enrollments/:id — drop a course
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.student._id,
    });

    if (!enrollment) {
      res.status(404);
      throw new Error("Enrollment not found");
    }

    enrollment.status = "dropped";
    await enrollment.save();
    await Course.findByIdAndUpdate(enrollment.course, { $inc: { enrolled: -1 } });

    res.json({ message: "Course dropped successfully" });
  })
);

module.exports = router;
