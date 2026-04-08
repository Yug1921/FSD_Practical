const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  if (err.name === "CastError") {
    return res.status(404).json({ message: "Resource not found" });
  }

  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue || {})[0];
    return res.status(400).json({
      message: duplicateField
        ? `${duplicateField} already exists`
        : "Duplicate value already exists",
    });
  }

  res.status(statusCode).json({
    message: err.message || "Server error",
  });
};

module.exports = { notFound, errorHandler };