const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
app.disable("x-powered-by");
connectDB();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/enrollments", require("./routes/enrollments"));

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

app.use("/api", notFound);

// Catch-all: serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
