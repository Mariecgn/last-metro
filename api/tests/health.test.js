import request from 'supertest';
const base = 'http://api:3000';

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(base).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
