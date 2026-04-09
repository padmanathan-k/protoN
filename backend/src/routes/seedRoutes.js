const express = require("express");
const {
  getSeedsByTheme,
  createSeed,
  getSeedTree,
  toggleSeedUpvote,
} = require("../controllers/seedController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/theme/:themeId", getSeedsByTheme);
router.get("/:seedId/tree", getSeedTree);
router.post("/", protect, createSeed);
router.post("/:seedId/upvote", protect, toggleSeedUpvote);

module.exports = router;
