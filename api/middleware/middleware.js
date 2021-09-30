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

const userSchema = yup.object().shape({
  name: yup
    .string()
    .typeError('name must be a string')
    .trim()
    .required('missing required name field')
})

async function validateUser(req, res, next) {
  try {
    const validated = await userSchema.validate(
      req.body,
      { strict: false, stripUnknown: true }
    )
    req.body = validated
    next()
  } catch (err) {
    next({ status: 400, message: err.message })
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
}

// do not forget to expose these functions to other modules
module.exports = { logger, validateUserId, validateUser }