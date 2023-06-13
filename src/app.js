const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
const authRouter = require('./modules/auth')

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
