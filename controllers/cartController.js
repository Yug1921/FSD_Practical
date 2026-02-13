exports.getCart = (req, res, next) => {
  try {
    res.json({ message: "Cart details" });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = (req, res, next) => {
  try {
    res.status(201).json({
      message: "Item added to cart",
      data: req.body
    });
  } catch (error) {
    next(error);
  }
};
