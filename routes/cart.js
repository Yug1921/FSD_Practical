const express = require("express");
const validate = require("../middleware/validate");
const { getCart, addToCart } = require("../controllers/cartController");

const router = express.Router();

router.get("/", getCart);
router.post("/", validate(["productId", "quantity"]), addToCart);

module.exports = router;
