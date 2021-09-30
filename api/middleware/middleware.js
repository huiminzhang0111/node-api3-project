const yup = require('yup')
const User = require('../users/users-model')

function logger(req, res, next) {
  console.log(`it is a ${req.method} request to ${req.originalUrl}`)
  next() // next without arguments, sends req and res along the pipe
}

async function validateUserId(req, res, next) {
  // if id legit, next()
  // if id bad, next({ user not found })
  try {
    const userMaybe = await User.getById(req.params.id)
    if (userMaybe) {
      req.user = userMaybe
      next()
    } else {
      next ({ status: 404, message: "user not found" })
    }
  } catch (error) {
    next(error)
  }
}

function validateUser(req, res, next) {
  const { name } = req.body
  if (!name || !name.trim()) {
    res.status(400).json({
      message: "missing required name field"
    })
  } else {
    req.name = name.trim()
    next()
  }
}

const postSchema = yup.object().shape({
  post: yup
    .string()
    .trim()
    .required("missing required text field")
})

async function validatePost(req, res, next) {
  try {
    const validatedPost = await postSchema.validate(
      req.body,
      { strict: false, stripUnknown: true }
    )
    req.body = validatePost
    next()
  } catch (err) {
    next({ status: 400, message: err.message })
  }
}

// do not forget to expose these functions to other modules
module.exports = { logger, validateUserId, validateUser, validatePost }