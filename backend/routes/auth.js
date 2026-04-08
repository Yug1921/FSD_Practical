const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const { protect } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
    const exists = await Student.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error("Email already registered");
    }

    const student = await Student.create({ name, email, password });
    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      studentId: student.studentId,
      token: generateToken(student._id),
    });
  }
  )
);

// POST /api/auth/login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
  const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (student && (await student.matchPassword(password))) {
      res.json({
        _id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        token: generateToken(student._id),
      });
      return;
    }

    res.status(401);
    throw new Error("Invalid email or password");
  }
  )
);

// GET /api/auth/profile
router.get("/profile", protect, asyncHandler(async (req, res) => {
  res.json(req.student);
}));

module.exports = router;
