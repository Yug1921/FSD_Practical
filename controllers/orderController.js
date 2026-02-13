exports.getOrders = (req, res, next) => {
  try {
    res.json({ message: "All orders" });
  } catch (error) {
    next(error);
  }
};

exports.createOrder = (req, res, next) => {
  try {
    res.status(201).json({
      message: "Order placed",
      data: req.body
    });
  } catch (error) {
    next(error);
  }
};
