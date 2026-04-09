const express = require("express");
const { getThemes, createTheme } = require("../controllers/themeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getThemes);
router.post("/", protect, createTheme);

module.exports = router;
