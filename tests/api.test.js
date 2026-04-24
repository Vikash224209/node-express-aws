'use strict';
const request = require('supertest');
const app     = require('../src/app');

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('uptime');
  });
});

describe('Items API', () => {
  it('GET /api/v1/items returns empty array initially', async () => {
    const res = await request(app).get('/api/v1/items');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('POST /api/v1/items creates an item', async () => {
    const res = await request(app)
      .post('/api/v1/items')
      .send({ name: 'widget' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toMatchObject({ name: 'widget' });
  });

  it('POST /api/v1/items without name returns 400', async () => {
    const res = await request(app).post('/api/v1/items').send({});
    expect(res.statusCode).toBe(400);
  });

  it('GET /api/v1/items/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/v1/items/9999');
    expect(res.statusCode).toBe(404);
  });
});

