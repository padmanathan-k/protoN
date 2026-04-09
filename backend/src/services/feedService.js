const User = require("../models/User");
const Post = require("../models/Post");

const getFeed = async (userId, maxDepth = 2) => {
  let queue = [{ id: userId, depth: 0 }];
  let visited = new Set();
  let users = [];

  while (queue.length) {
    const { id, depth } = queue.shift();
    if (depth > maxDepth || visited.has(id)) continue;

    visited.add(id);
    users.push(id);

    const user = await User.findById(id);
    user.children.forEach(child =>
      queue.push({ id: child, depth: depth + 1 })
    );
  }

  return await Post.find({ userId: { $in: users } })
                   .sort({ createdAt: -1 });
};

module.exports = { getFeed };