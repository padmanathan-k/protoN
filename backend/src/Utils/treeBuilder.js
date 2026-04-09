const buildReedTree = (reeds) => {
  const map = new Map();
  const rootNodes = [];

  reeds.forEach((reed) => {
    map.set(String(reed._id), {
      ...reed.toObject(),
      children: [],
    });
  });

  map.forEach((reedNode) => {
    if (reedNode.parentReed) {
      const parent = map.get(String(reedNode.parentReed));

      if (parent) {
        parent.children.push(reedNode);
        return;
      }
    }

    rootNodes.push(reedNode);
  });

  return rootNodes;
};

module.exports = { buildReedTree };
