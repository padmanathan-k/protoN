const Reed = require("../models/Reed");
const Seed = require("../models/Seed");

const createReed = async (req, res, next) => {
  try {
    const { seedId, parentReedId, content } = req.body;

    if (!seedId || !content) {
      return res.status(400).json({ message: "Seed and content are required" });
    }

    const seed = await Seed.findById(seedId);

    if (!seed) {
      return res.status(404).json({ message: "Seed not found" });
    }

    if (parentReedId) {
      const parentReed = await Reed.findById(parentReedId);

      if (!parentReed) {
        return res.status(404).json({ message: "Parent reed not found" });
      }
    }

    const reed = await Reed.create({
      seed: seedId,
      parentReed: parentReedId || null,
      content,
      author: req.user._id,
    });

    const populatedReed = await reed.populate("author", "username");

    res.status(201).json({
      ...populatedReed.toObject(),
      children: [],
      upvoteCount: populatedReed.upvotes.length,
    });
  } catch (error) {
    next(error);
  }
};

const toggleReedUpvote = async (req, res, next) => {
  try {
    const reed = await Reed.findById(req.params.reedId);

    if (!reed) {
      return res.status(404).json({ message: "Reed not found" });
    }

    const userId = String(req.user._id);
    const alreadyUpvoted = reed.upvotes.some((vote) => String(vote) === userId);

    if (alreadyUpvoted) {
      reed.upvotes = reed.upvotes.filter((vote) => String(vote) !== userId);
    } else {
      reed.upvotes.push(req.user._id);
    }

    await reed.save();

    res.json({
      upvoteCount: reed.upvotes.length,
      hasUpvoted: !alreadyUpvoted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReed,
  toggleReedUpvote,
};
