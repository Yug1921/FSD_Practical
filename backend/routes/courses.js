const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { protect } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

// GET /api/courses — list all courses
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
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
  })
);

// GET /api/courses/:id
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }
    res.json(course);
  })
);

// POST /api/courses — seed/create a course (admin use)
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  })
);

module.exports = router;
