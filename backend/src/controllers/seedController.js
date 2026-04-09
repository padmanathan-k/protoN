const Seed = require("../models/Seed");
const Reed = require("../models/Reed");
const Theme = require("../models/Theme");
const { buildReedTree } = require("../Utils/treeBuilder");

const serializeVoteCount = (doc) => ({
  ...doc,
  upvoteCount: doc.upvotes.length,
});

const getSeedsByTheme = async (req, res, next) => {
  try {
    const seeds = await Seed.find({ theme: req.params.themeId })
      .populate("author", "username")
      .populate("theme", "title")
      .sort({ createdAt: -1 });

    res.json(seeds.map((seed) => serializeVoteCount(seed.toObject())));
  } catch (error) {
    next(error);
  }
};

const createSeed = async (req, res, next) => {
  try {
    const { themeId, title, content, mediaType, mediaUrl } = req.body;

    if (!themeId || !title || !content) {
      return res.status(400).json({ message: "Theme, title, and content are required" });
    }

    const theme = await Theme.findById(themeId);

    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    const seed = await Seed.create({
      theme: themeId,
      title,
      content,
      mediaType: mediaUrl ? mediaType || "image" : "none",
      mediaUrl: mediaUrl || "",
      author: req.user._id,
    });

    const populatedSeed = await seed.populate([
      { path: "author", select: "username" },
      { path: "theme", select: "title" },
    ]);

    res.status(201).json(serializeVoteCount(populatedSeed.toObject()));
  } catch (error) {
    next(error);
  }
};

const getSeedTree = async (req, res, next) => {
  try {
    const seed = await Seed.findById(req.params.seedId)
      .populate("author", "username")
      .populate("theme", "title");

    if (!seed) {
      return res.status(404).json({ message: "Seed not found" });
    }

    const reeds = await Reed.find({ seed: req.params.seedId })
      .populate("author", "username")
      .sort({ createdAt: 1 });

    res.json({
      ...serializeVoteCount(seed.toObject()),
      reeds: buildReedTree(reeds).map(serializeVoteCount),
    });
  } catch (error) {
    next(error);
  }
};

const toggleSeedUpvote = async (req, res, next) => {
  try {
    const seed = await Seed.findById(req.params.seedId);

    if (!seed) {
      return res.status(404).json({ message: "Seed not found" });
    }

    const userId = String(req.user._id);
    const alreadyUpvoted = seed.upvotes.some((vote) => String(vote) === userId);

    if (alreadyUpvoted) {
      seed.upvotes = seed.upvotes.filter((vote) => String(vote) !== userId);
    } else {
      seed.upvotes.push(req.user._id);
    }

    await seed.save();

    res.json({
      upvoteCount: seed.upvotes.length,
      hasUpvoted: !alreadyUpvoted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSeedsByTheme,
  createSeed,
  getSeedTree,
  toggleSeedUpvote,
};
