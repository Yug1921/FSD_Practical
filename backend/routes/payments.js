const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Payment = require("../models/Payment");
const { protect } = require("../middleware/auth");

// Generate a unique transaction ID using crypto
const generateTransactionId = () =>
  "TXN" + Date.now() + crypto.randomBytes(4).toString("hex").toUpperCase();

// POST /api/payments/process — mock payment processing
router.post("/process", protect, async (req, res) => {
  const { amount, description, cardNumber } = req.body;

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ message: "Valid payment amount is required" });
  }

  if (!cardNumber || cardNumber.toString().length < 4) {
    return res.status(400).json({ message: "Valid card number is required" });
  }

  // Mock: fail if card number starts with 0000
  const cardStr = cardNumber.toString().replace(/\s/g, "");
  const isSuccess = !cardStr.startsWith("0000");
  const status = isSuccess ? "success" : "failed";
  const cardLastFour = cardStr.slice(-4);

  try {
    const payment = await Payment.create({
      student: req.student._id,
      amount: Number(amount),
      description: description || "Course registration fee",
      status,
      transactionId: generateTransactionId(),
      cardLastFour,
    });

    if (!isSuccess) {
      return res.status(402).json({
        message: "Payment failed. Please check your card details.",
        status: "failed",
        transactionId: payment.transactionId,
      });
    }

    res.status(201).json({
      message: "Payment processed successfully",
      status: "success",
      transactionId: payment.transactionId,
      amount: payment.amount,
      currency: payment.currency,
      cardLastFour: payment.cardLastFour,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/payments/history — get payment history for the logged-in student
router.get("/history", protect, async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.student._id }).sort({
      createdAt: -1,
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/payments/status/:transactionId — get status of a specific payment
router.get("/status/:transactionId", protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      transactionId: req.params.transactionId,
      student: req.student._id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      transactionId: payment.transactionId,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      description: payment.description,
      createdAt: payment.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
