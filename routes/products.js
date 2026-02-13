const express = require("express");
const validate = require("../middleware/validate");
const { getProducts, createProduct } = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.post("/", validate(["name", "price"]), createProduct);

module.exports = router;
