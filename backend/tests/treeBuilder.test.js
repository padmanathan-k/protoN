const { buildReedTree } = require("../src/Utils/treeBuilder");

const makeReed = (id, parentReed = null, content = "") => ({
  _id: id,
  parentReed,
  toObject() {
    return {
      _id: id,
      parentReed,
      content,
    };
  },
});

describe("buildReedTree", () => {
  it("creates a nested reed tree from flat reeds", () => {
    const reeds = [
      makeReed("root-1", null, "first root"),
      makeReed("child-1", "root-1", "child branch"),
      makeReed("grandchild-1", "child-1", "deep branch"),
      makeReed("root-2", null, "second root"),
    ];

    const tree = buildReedTree(reeds);

    expect(tree).toHaveLength(2);
    expect(tree[0]._id).toBe("root-1");
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0]._id).toBe("child-1");
    expect(tree[0].children[0].children[0]._id).toBe("grandchild-1");
    expect(tree[1]._id).toBe("root-2");
  });

  it("treats reeds with missing parents as root nodes", () => {
    const reeds = [makeReed("orphan", "missing-parent", "orphaned branch")];

    const tree = buildReedTree(reeds);

    expect(tree).toHaveLength(1);
    expect(tree[0]._id).toBe("orphan");
    expect(tree[0].children).toEqual([]);
  });
});
