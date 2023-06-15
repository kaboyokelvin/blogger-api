const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  tags: [String],
  title: String,
  content: String,
  draft: Boolean,
  Featured: { type: Boolean, default: false }
  // comments: [String]
}, {
  timestamps: true
})

const blogModel = mongoose.model('blog', blogSchema)

module.exports = blogModel
