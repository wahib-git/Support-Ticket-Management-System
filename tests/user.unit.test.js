const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();


beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, {});
});

afterAll(async () => {
  await User.deleteMany({}); 
  await mongoose.connection.close();
});

describe("User model", () => {
  it("should hash password before saving", async () => {
    const user = new User({
      name: "Test",
      email: "test@example.com",
      password: "plainpassword",
      role: "agent",
      specialization: "Infrastructure informatique",
    });
    await user.save();
    expect(user.password).not.toBe("plainpassword");
  }, 15000);
});
