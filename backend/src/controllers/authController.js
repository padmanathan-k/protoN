const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || "protoN-secret", {
    expiresIn: "7d",
  });

const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  headline: user.headline,
  bio: user.bio,
  location: user.location,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt,
});

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      passwordHash,
    });

    res.status(201).json({
      token: createToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { identifier, email, password } = req.body;
    const loginIdentifier = (identifier || email || "").trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: "Username or email and password are required" });
    }

    const user = await User.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        { username: loginIdentifier },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: createToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { username, email, headline, bio, location, avatarUrl } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: user._id } });

      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      user.username = username.trim();
    }

    if (email && email.toLowerCase() !== user.email) {
      const normalizedEmail = email.toLowerCase();
      const existingEmail = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });

      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      user.email = normalizedEmail;
    }

    user.headline = headline ?? user.headline;
    user.bio = bio ?? user.bio;
    user.location = location ?? user.location;
    user.avatarUrl = avatarUrl ?? user.avatarUrl;

    await user.save();

    res.json({
      token: createToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
