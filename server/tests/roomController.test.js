const request = require('supertest');
const mongoose = require('mongoose');
const Room = require('../models/Room');

describe('Room Controller - Input Validation Tests', () => {
  let app;

  beforeAll(async () => {
    app = require('../server');
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    await Room.deleteMany({ name: /test/i });
    await mongoose.connection.close();
  });

  describe('POST /api/rooms', () => {
    it('should reject room creation with invalid price', async () => {
      const res = await request(app).post('/api/rooms').send({
        name: 'Test Room',
        category: 'deluxe',
        price: -100, // Negative price
        maxGuests: 2,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('positive number');
    });

    it('should reject room creation with invalid maxGuests', async () => {
      const res = await request(app).post('/api/rooms').send({
        name: 'Test Room',
        category: 'deluxe',
        price: 100,
        maxGuests: 25, // Over max (20)
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('between 1 and 20');
    });

    it('should reject room creation with invalid category', async () => {
      const res = await request(app).post('/api/rooms').send({
        name: 'Test Room',
        category: 'invalid-category',
        price: 100,
        maxGuests: 2,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Invalid category');
    });

    it('should reject room creation with missing required fields', async () => {
      const res = await request(app).post('/api/rooms').send({
        name: 'Test Room',
        category: 'deluxe',
        // missing price and maxGuests
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('required');
    });

    it('should accept valid room creation', async () => {
      const roomData = {
        name: 'Valid Test Room',
        category: 'deluxe',
        price: 150.5,
        maxGuests: 4,
        description: 'A beautiful room',
        amenities: ['WiFi', 'TV', 'AC'],
      };

      const res = await request(app).post('/api/rooms').send(roomData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.room.price).toBe(150.5);
      expect(res.body.room.category).toBe('deluxe');
    });
  });

  describe('GET /api/rooms', () => {
    it('should fetch all rooms', async () => {
      const res = await request(app).get('/api/rooms');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.rooms)).toBe(true);
    });
  });
});
