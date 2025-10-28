import request from 'supertest';
const base = 'http://api:3000';

describe('Stations CRUD', () => {
  it('creates a station', async () => {
    const res = await request(base)
      .post('/stations')
      .set('content-type','application/json')
      .send({ name: 'Bastille', line: 'M1' });

    expect([200,201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Bastille');
  });
});
