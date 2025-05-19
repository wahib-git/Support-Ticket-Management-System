const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Tickets API", () => {
  it("should return 401 if not authenticated", async () => {
    const res = await request(app).post("/api/tickets").send({
      title: "Test ticket",
      description: "desc",
      category: "Infrastructure informatique",
      priority: "urgent",
    });
    expect(res.statusCode).toBe(401);
  });
});
