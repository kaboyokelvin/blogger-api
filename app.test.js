const request = require('supertest')
const app = require('./src/app')
const userModel = require('./src/models/users')
require('dotenv').config()

describe('Test Authentication', () => {
  afterAll(async () => {
    if (process.env.NODE_ENV === 'test') { await userModel.deleteMany({}) }
  })

  jest.setTimeout(50000)
  test('It should respond with status 201 on successful sign up', async () => {
    const response = await request(app).post('/signup').send({
      email: 'nyabongoedgar2@gmail.com',
      password: 'Qwerty12345!'
    })
    expect(response.statusCode).toBe(201)
  })

  test('It should response with status 400 on sign up with similar details', async () => {
    const response = await request(app).post('/signup').send({
      email: 'nyabongoedgar2@gmail.com',
      password: 'Qwerty12345!'
    })
    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Email already in use')
  })
})
