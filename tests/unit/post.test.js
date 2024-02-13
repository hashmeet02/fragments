const request = require('supertest');
const app = require('../../src/app');
const { readFragment } = require('../../src/model/data');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair user should be able to post a fragment with a valid response of 201 and ok status
  test('authenticated users post a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send('test Fragment data')
      .set('Content-type', 'text/plain')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });

  //Authenticated user posting a non-supportive content-type should get appropriate error code and message.
  test('authenticated user post non-supported content-type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send('test Fragment data')
      .set('Content-type', 'video/mp4')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('Content-Type not supported');
  });

  //All requested properties are successfully received.
  test('all neccessary properties are successfully received', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send('test fragment data')
      .set('Content-type', 'text/plain')
      .auth('user1@email.com', 'password1');
    const fragment = await readFragment(res.body.fragment.ownerId, res.body.fragment.id);
    expect(res.body.fragment).toEqual(fragment);
    const expectedLocation = `${process.env.API_URL || res.headers.host}/v1/fragments/${
      fragment.id
    }`;
    expect(res.headers.location).toEqual(expectedLocation);
  });
});
