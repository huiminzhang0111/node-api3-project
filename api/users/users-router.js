const express = require('express');
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware');
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
const { ValidationError } = require('yup');
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  Users.get(req.query)
    .then(users => {
      res.status(200).json(users)
    })
    .catch(error => {
      next(error)
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  }).catch(next)
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid

});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  Users.update(req.params.id, { name: req.name })
  .then(() => {
    return Users.getById(req.params.id)
  })
  .then(user => {
    res.json(user)
  })
  .catch(next)
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try {
    const result = await Users.remove(req.params.id)
    res.json(req.user)
} catch (err) {
  next(err)
}
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const result = await Users.getUserPosts(req.params.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async(req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const result = await Posts.insert({
      user_id: req.params.id,
      text: req.text,
    })
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
});

// do not forget to export the router
module.exports = router;