exports.getUsers = (req, res, next) => {
  try {
    res.json({ message: "All users" });
  } catch (error) {
    next(error);
  }
};

exports.createUser = (req, res, next) => {
  try {
    res.status(201).json({
      message: "User created",
      data: req.body
    });
  } catch (error) {
    next(error);
  }
};
