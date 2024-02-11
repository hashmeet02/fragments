// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('unavailable route', () => {
  //if the user tries to access a non-existing route the user should get an http 404 error.
  test('non-existing route returns 404', () => request(app).get('/non-existing-route').expect(404));
});
