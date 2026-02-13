exports.getProducts = (req, res, next) => {
  try {
    res.json({ message: "All products" });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = (req, res, next) => {
  try {
    res.status(201).json({
      message: "Product created",
      data: req.body
    });
  } catch (error) {
    next(error);
  }
};
