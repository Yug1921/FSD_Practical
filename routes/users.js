const express = require("express");
const validate = require("../middleware/validate");
const { getUsers, createUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.post("/", validate(["username", "email"]), createUser);

module.exports = router;
