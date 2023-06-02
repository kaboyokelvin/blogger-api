const request = require('supertest');
const app = require('./src/app'); // Replace './app' with the path to your app's entry point

describe('Test the root path', () => {
  test('It should respond with status 201 on successful sign up', async () => {
    const response = await request(app).post('/signup')
    expect(response.statusCode).toBe(201);
  });
});
