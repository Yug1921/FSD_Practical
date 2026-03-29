const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { protect } = require("../middleware/auth");

// GET /api/courses — list all courses
router.get("/", protect, async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = {};

    if (department) query.department = department;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { courseCode: { $regex: search, $options: "i" } },
        { instructor: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(query).sort({ courseCode: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/courses/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/courses — seed/create a course (admin use)
router.post("/", protect, async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
