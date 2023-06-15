const express = require('express')
const blogRouter = express.Router()
const verifyToken = require('../../middleware/auth/verifyToken')
const { blog } = require('../../models')
const mongoose = require('mongoose')

blogRouter.post('/create-blogs', verifyToken, async (req, res, next) => {
  try {
    const { tags, title, content, draft } = req.body
    const blogCreated = await blog.create({ userId: req.userId, title, content, tags, draft })
    res.json({
      message: 'blog created',
      blog: blogCreated
    })
  } catch (error) {
    next(error)
  }
})

blogRouter.get('/get-allblogs', verifyToken, async (req, res, next) => {
  try {
    const allblogs = await blog.find({})
    res.json({ allblogs })
  } catch (error) {
    next(error)
  }
})

blogRouter.get('/get-oneblog/:title', verifyToken, async (req, res, next) => {
  try {
    const allblogs = await blog.find({ title: req.params.title })
    res.json({ allblogs })
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/delete-blog/:id', verifyToken, async (req, res, next) => {
  try {
    const objectId = new mongoose.Types.ObjectId(req.params.id)
    await blog.deleteOne(objectId)
    res.json({ message: 'record successfully deleted' })
  } catch (error) {
    next(error)
  }
})

blogRouter.patch('/edit/:id', verifyToken, async (req, res, next) => {
  try {
    const objectId = new mongoose.Types.ObjectId(req.params.id)
    if (!await blog.findOne(objectId)) {
      res.json({ message: 'Record not found' })
    } else {
      await blog.findOneAndUpdate(objectId, { title: req.body.title, content: req.body.content, tags: req.body.tags }, { upsert: false })
      res.json({ message: 'record successfully updated' })
    }
  } catch (error) {
    next(error)
  }
})
module.exports = blogRouter
