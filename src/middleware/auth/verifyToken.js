const jwt = require('jsonwebtoken')

export default function verifyToken (req, res, next) {
  const authHeader = req.headers.authorization

  if (authHeader !== 'undefined') {
    const token = authHeader.split(' ')[1]

    try {
      const decodedJWT = jwt.verify(token, process.env.SECRET)
      req.userId = decodedJWT._id
      next()
    } catch (error) {
      next(error)
    }
  } else {
    res.status(401).json({
      message: 'jwt required'
    })
  }
}

module.exports = verifyToken
