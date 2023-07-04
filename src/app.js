const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const authRouter = require('./modules/auth')
const blogRouter = require('./modules/blog/blogRoutes')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cors())
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => { console.log('DB connected') })
  .catch(error => console.log(error.message))

app.use('/users/auth', authRouter)
app.use('/blogs', blogRouter)

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Something broke!', error: err.message })
})

module.exports = app
