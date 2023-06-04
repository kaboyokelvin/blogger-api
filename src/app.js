const express = require('express')
const mongoose = require('mongoose')
const user = require('./models/users')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const app = express()

async function verifyToken (req, res, next) {
  const authHeader = req.headers.authorization
  if (authHeader !== 'undefined') {
    const token = authHeader.split(' ')[1]
    const decode = jwt.verify(token, process.env.SECRET)
    if (decode) {
      next()
    } else {
      (
        res.status(400).json({ message: 'token authentication failed' })
      )
    }
  } else {
    res.status(401).json({ message: 'token not found' })
  }
}

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI)
  .catch(error => console.log(error.message))

app.post('/signup', async (req, res, next) => {
  try {
    const userEmail = req.body.email
    const password = req.body.password
    if (userEmail && password) {
      if (validator.isEmail(userEmail)) {
        const checkEmail = await user.findOne({ email: userEmail })
        if (checkEmail) {
          res.status(400).json({ message: 'Email already in use' })
        } else {
          const hashedPassword = await bcrypt.hash(password, 10)
          await user.create({ email: userEmail, password: hashedPassword })
          res.status(201).json({ message: 'User created' })
        }
      } else {
        res.status(400).json({ message: 'invalid email format' })
      }
    } else {
      res.status(400).json({
        message: 'Email and password fields required'
      })
    }
  } catch (error) {
    console.log(error, 'errr')
    next(error)
  }
})

app.post('/signin', async (req, res, next) => {
  try {
    const userEmail = req.body.email
    const password = req.body.password
    if (validator.isEmail(userEmail)) {
      const checkEmail = await user.findOne({ email: userEmail })
      if (checkEmail) {
        const match = await bcrypt.compare(password, checkEmail.password)
        if (match) {
          const token = jwt.sign({ userEmail, password }, process.env.SECRET)
          res.status(200).json({
            token,
            message: 'successfully logged in'
          })
        } else {
          res.json({ message: 'incorrect password entered' })
        }
      } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        await user.create({ email: userEmail, password: hashedPassword })
        res.status(201).json({ message: 'User created' })
      }
    } else {
      res.json({ message: 'invalid email format' })
    }
  } catch (error) {
    next(error)
  }
})

app.post('/signin', async (req, res, next) => {
  const userEmail = req.body.email
  const password = req.body.password
  if (validator.isEmail(userEmail)) {
    const checkEmail = await user.findOne({ email: userEmail })
    if (checkEmail) {
      const match = await bcrypt.compare(password, checkEmail.password)
      if (match) {
        const token = jwt.sign({ userEmail, password }, process.env.SECRET)
        res.json(token)
        res.json('successfully logged in')
      } else {
        res.json({ message: 'incorrect password entered' })
      }
    } else {
      res.json({ message: 'Email does not exist' })
    }
  } else {
    res.json({ message: 'invalid email format' })
  }
})

app.get('/', verifyToken, (req, res) => {
  res.json({ message: 'token worked' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Something broke!', error: err.message })
})

module.exports = app
