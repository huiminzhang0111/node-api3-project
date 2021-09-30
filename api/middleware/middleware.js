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
  // DO YOUR MAGIC
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
}

// do not forget to expose these functions to other modules
module.exports = { logger, validateUserId }