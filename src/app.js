const express = require('express')
const mongoose = require('mongoose')
const user = require('./models/users')
const bcrypt = require('bcrypt')
const validator = require('validator')

const app = express()

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
          res.json({ message: 'Email already in use' })
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
            message: "Email and password fields required"
        })
    }
  } catch (error) {
    console.log(error, 'errr')
    next(error)
  }
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Something broke!', error: err.message })
})

module.exports = app
