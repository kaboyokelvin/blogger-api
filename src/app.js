const express = require('express')
const mongoose = require('mongoose')
const user = require('./models/users')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
require('dotenv').config()
const Joi = require('joi')
const { validateBody } = require('./middleware/validation/apiValidation')
const app = express()
const authRouter = require('./modules/auth');
// eslint-disable-next-line no-unused-vars

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => { console.log('DB connected') })
  .catch(error => console.log(error.message))

app.use('/users/auth', authRouter)

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Something broke!', error: err.message })
})

module.exports = app
