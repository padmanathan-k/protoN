const Theme = require("../models/Theme");

const getThemes = async (req, res, next) => {
  try {
    const themes = await Theme.find()
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.json(themes);
  } catch (error) {
    next(error);
  }
};

const createTheme = async (req, res, next) => {
  try {
    const { title, description, themeType } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Theme title is required" });
    }

    const theme = await Theme.create({
      title,
      description,
      themeType: themeType || "standard",
      createdBy: req.user._id,
    });

    const populatedTheme = await theme.populate("createdBy", "username");

    res.status(201).json(populatedTheme);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getThemes,
  createTheme,
};
