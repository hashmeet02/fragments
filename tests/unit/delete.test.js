const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments', () => {
  test('fragment is deleted successfully with correct id', async () => {
    const req = await request(app)
      .post('/v1/fragments')
      .send('Test fragment of text type')
      .set('Content-type', 'text/plain')
      .auth('user1@email.com', 'password1');

    const res = await request(app)
      .delete(`/v1/fragments/${req.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('deletion error with invalid fragment id', async () => {
    const res = await request(app)
      .delete(`/v1/fragments/invalidID`)
      .auth('user1@email.com', 'password1');
    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Fragment not found');
  });
});
