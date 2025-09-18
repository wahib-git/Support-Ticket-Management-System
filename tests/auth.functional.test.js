const request = require("supertest");
const app = require("../src/server");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");

describe("Auth flow", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should not allow access to protected route without token", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.statusCode).toBe(401);
  });
});
