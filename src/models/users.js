const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

  email: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel
