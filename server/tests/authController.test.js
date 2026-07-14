const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');

// Note: Start server with: npm test
// Assumes MongoDB is running and database is test-db

describe('Auth Controller - Input Validation Tests', () => {
  let app;

  beforeAll(async () => {
    // Initialize app
    app = require('../server');
    // Wait for MongoDB connection
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteMany({ email: /test/ });
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('should reject registration with invalid email', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Invalid email format');
    });

    it('should reject registration with short password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('at least 6 characters');
    });

    it('should reject registration with missing fields', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        // missing password
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('required');
    });

    it('should prevent role override during registration', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'roletest@example.com',
        password: 'password123',
        role: 'admin', // Try to register as admin
      });

      expect(res.statusCode).toBe(201);
      const user = await User.findOne({ email: 'roletest@example.com' });
      expect(user.role).toBe('user'); // Should always be 'user'
    });

    it('should reject duplicate email registration', async () => {
      const email = 'duplicate@example.com';

      // First registration
      await request(app).post('/api/auth/register').send({
        name: 'User 1',
        email,
        password: 'password123',
      });

      // Second registration with same email
      const res = await request(app).post('/api/auth/register').send({
        name: 'User 2',
        email,
        password: 'password123',
      });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toContain('already registered');
    });

    it('should successfully register valid user', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Valid User',
        email: 'validuser@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('validuser@example.com');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should reject login with invalid email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'not-an-email',
        password: 'password123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Invalid email');
    });

    it('should reject login with missing credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        // missing password
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('required');
    });
  });
});
