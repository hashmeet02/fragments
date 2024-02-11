// tests/unit/get.test.js

const request = require('supertest');
const hash = require('../../src/hash');
const app = require('../../src/app');
const { readFragmentData } = require('../../src/model/data');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  //a valid user name and password should with no saved fragments should return empty array
  test('authenticated user with no fragments get an empty array', async () => {
    const res = await request(app).get('/v1/fragments/').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.fragments).toEqual([]);
  });

  //authenticated user get appropriate error when try to retrieve fragment with incorrect Id
  test('authenticated user gets error gets fragment with incorrect Id', async () => {
    const res = await request(app)
      .get(`/v1/fragments/invalidID`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
    expect(res.body.error.message).toBe(`Fragment with invalidID doesn't exist`);
  });

  //authenticated user can successfully retrieve fragment with particular Id
  test('authenticated user with fragments can get it by Id', async () => {
    const req = await request(app)
      .post('/v1/fragments/')
      .auth('user1@email.com', 'password1')
      .send('Test Fragment')
      .set('Content-type', 'text/plain');
    const fragment = await readFragmentData(hash('user1@email.com'), req.body.fragment.id);
    const id = req.body.fragment.id;
    const res = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');

    expect(res.text).toBe(fragment.toString());
  });

  //test to successfully convert html extension to text
  test('html extension is successfully converted to text', async () => {
    const req = await request(app)
      .post('/v1/fragments/')
      .auth('user1@email.com', 'password1')
      .send('<h1> Test Fragment </h1>')
      .set('Content-type', 'text/html');
    const id = req.body.fragment.id;
    const res = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('<h1> Test Fragment </h1>');
  });
});
