const express = require('express')
const { user } = require('../../models')
const bcrypt = require('bcrypt')
const validator = require('validator')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
require('dotenv').config()
const Joi = require('joi')
const { validateBody } = require('../../middleware/validation/apiValidation')
const jwt = require('jsonwebtoken')

const authRouter = express.Router()

authRouter.post('/sign-up', async (req, res, next) => {
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

authRouter.post('/sign-in', async (req, res, next) => {
  try {
    const userEmail = req.body.email
    const password = req.body.password
    if (validator.isEmail(userEmail)) {
      const checkEmail = await user.findOne({ email: userEmail })
      if (checkEmail) {
        const match = await bcrypt.compare(password, checkEmail.password)
        if (match) {
          console.log(checkEmail._id, 'checkEmail._id')
          const token = jwt.sign({ _id: checkEmail._id }, process.env.SECRET)
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

authRouter.post('/forgot-password', async (req, res, next) => {
  try {
    const email = req.body.email
    if (await user.findOne({ email })) {
      const token = crypto.randomBytes(20).toString('hex')

      await user.findOneAndUpdate(
        { email },
        {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 60000
        }
      )

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_ADDRESS,
          pass: process.env.MAIL_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      })

      const mailOptions = {
        from: 'kaboyokelvin@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        text: `You are receiving this email because you (or someone else) have requested a password reset for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${process.env.CLIENT_URL}/reset-password/${token}   \n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`
      }

      await transporter.sendMail(mailOptions)
      res
        .status(200)
        .json({
          message:
          'An email containing a password reset link has been sent to your email address. Please check your inbox and follow the instructions to reset your password.'
        })
    }
  } catch (error) {
    next(error)
  }
})

const resetPasswordBodySchema = Joi.object({
  password: Joi.string().required()
})

authRouter.post(
  '/reset-password/:token',
  (req, res, next) => validateBody(req, res, next, resetPasswordBodySchema),
  async (req, res, next) => {
    try {
      const token = req.params.token
      const password = req.body.password
      const hashedPassword = await bcrypt.hash(password, 10)

      const data = await user.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $lte: Date.now() }
      })
      if (!data) {
        return res.status(400).json({
          message: 'Invalid token provided'
        })
      }
      await user.updateOne(
        {
          _id: data._id
        },
        {
          password: hashedPassword,
          resetPasswordExpires: null,
          resetPasswordToken: null
        }
      )
      res.status(200).json({ message: 'Password reset successfully' })
    } catch (error) {
      next(error)
    }
  }
)

module.exports = authRouter
