const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const { protect } = require("../middleware/auth");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Student.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const student = await Student.create({ name, email, password });
    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      studentId: student.studentId,
      token: generateToken(student._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (student && (await student.matchPassword(password))) {
      res.json({
        _id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        token: generateToken(student._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/profile
router.get("/profile", protect, async (req, res) => {
  res.json(req.student);
});

module.exports = router;
