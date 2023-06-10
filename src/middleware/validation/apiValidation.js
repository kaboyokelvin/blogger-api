const validateParams = (req, res, next, schema) => {
  const { error } = schema.validate(req.params)

  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  next()
}

const validateQueryStrings = (req, res, next, schema) => {
  const { error } = schema.validate(req.query)

  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  next()
}

const validateBody = (req, res, next, schema) => {
  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  next()
}

export { validateParams, validateQueryStrings, validateBody }
