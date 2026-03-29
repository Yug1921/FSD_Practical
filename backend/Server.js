require("dotenv").config({ path: "./backend/.env" });
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

console.log("JWT_SECRET =", process.env.JWT_SECRET);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/enrollments", require("./routes/enrollments"));

// Catch-all: serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
