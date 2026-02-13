const express = require("express");
const validate = require("../middleware/validate");
const { getOrders, createOrder } = require("../controllers/orderController");

const router = express.Router();

router.get("/", getOrders);
router.post("/", validate(["userId", "total"]), createOrder);

module.exports = router;
