const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Auth flow', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should not allow access to protected route without token', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.statusCode).toBe(401);
  });
});