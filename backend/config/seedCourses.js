// backend/config/seedCourses.js

const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/../.env" });

const Course = require("../models/Course");

mongoose.connect(process.env.MONGO_URI);

const courses = [
  {
    title: "Data Structures",
    courseCode: "CS201",
    instructor: "Dr. Sharma",
    department: "Computer Science",
    credits: 4,
    capacity: 60,
    schedule: "Mon-Wed 10:00 AM"
  },
  {
    title: "Operating Systems",
    courseCode: "CS301",
    instructor: "Dr. Mehta",
    department: "Computer Science",
    credits: 4,
    capacity: 50,
    schedule: "Tue-Thu 11:30 AM"
  },
  {
    title: "Database Management Systems",
    courseCode: "CS305",
    instructor: "Dr. Patel",
    department: "Computer Science",
    credits: 3,
    capacity: 45,
    schedule: "Mon-Fri 2:00 PM"
  },
  {
    title: "Computer Networks",
    courseCode: "CS310",
    instructor: "Dr. Verma",
    department: "Computer Science",
    credits: 3,
    capacity: 40,
    schedule: "Wed-Fri 9:00 AM"
  }
];

async function seed() {
  await Course.deleteMany();
  await Course.insertMany(courses);

  console.log("Courses inserted successfully");
  process.exit();
}

seed();