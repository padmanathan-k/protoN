const express = require("express");
const { createReed, toggleReedUpvote } = require("../controllers/reedController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createReed);
router.post("/:reedId/upvote", protect, toggleReedUpvote);

module.exports = router;
