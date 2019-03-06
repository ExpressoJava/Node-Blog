// code away!

const express = require('express')
const server = express()
const cors = require('cors')
const helmet = require('helmet')

const users = require('./users/users')
const posts = require('./posts/posts')



const parser = express.json()

// middleware
server.use(parser, cors(), helmet() ) 

server.use('/users', users)
server.use('/posts', posts)

const port = 7000



     
  const errorHandle = (err, req, res, next) => {
    const errors = {
      u1: {
        title: "Require Name",
        description: "Name is required.",
        httpCode: 400
      },
      u2: {
        title: "Require Name",
        description: "Name is too long, needs to be less than 128 characters.",
        httpCode: 400
      },
      u20: {
        title: "Wrong id",
        description: "The id you have entered is not connected to any posts.",
        httpCode: 400
      }
    }
  
    const error = errors[err];
    res.status(error.httpCode).json(error);
  }
  
  server.use(errorHandle);


server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})