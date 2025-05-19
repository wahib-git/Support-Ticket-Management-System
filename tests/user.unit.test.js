const User = require('../models/User');

describe('User model', () => {
  it('should hash password before saving', async () => {
    const user = new User({
      name: 'Test',
      email: 'test@example.com',
      password: 'plainpassword',
      role: 'agent',
      specialization: 'Infrastructure informatique'
    });
    await user.save();
    expect(user.password).not.toBe('plainpassword');
  }, 15000); // 15 secondes
});

afterAll(async () => {
  await require('mongoose').connection.close();
});