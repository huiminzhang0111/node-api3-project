const express = require('express'); // importing a commonJS module
// global middlewares and the user's router need to be connected here
const usersRouter = require('./users/users-router.js')

const server = express();
// remember express by default cannot parse JSON in request bodies
server.use(express.json());
server.use('/api/users', logger, usersRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('*', (req, res, next) => {
  // catch all 404 errors middleware
  // calling next with an argument, sends the argument as err
  // to the err handling middleware
  next({ status: 404, message: `${req.method} ${req.originalUrl} not found!` })
})

server.use(errorHandling) // will trap errors happening above 

module.exports = server;

function logger(req, res, next) {
  console.log(`it is a ${req.method} request to ${req.originalUrl}`)
  next() // next without arguments, sends req and res along the pipe
}

function errorHandling(err, req, res, next) {
  // connect this with server.use at the end of the pipeline
  res.status(err.status || 500).json({
    message: err.message,
  })
}