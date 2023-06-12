const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  userId: String,
  Tags: [String],
  title: String,
  content: String,
  draft: Boolean,
  Featured: Boolean,
  comments: [String],
  createdAt: Date,
  updatedAt: Date
})

const blogModel = mongoose.model('blog', blogSchema)

module.exports = blogModel
