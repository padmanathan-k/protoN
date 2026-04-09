const request = require("supertest");
const app = require("../src/app");

describe("protoN backend app", () => {
  it("returns a health response", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "protoN for Social API is running",
    });
  });
});
