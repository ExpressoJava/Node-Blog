const express = require('express')
const userRouter = express.Router()

const userDb = require('../data/helpers/userDb')

const validate = (req, res, next) => {
  if(!req.body.name) {
    next('u1');
  } else if (req.body.name.length > 128) {   
    next('u2');
  } else {
    next();
  }
}

const Uppercase = (req, res, next) => {
  if(!req.body.name) {
    next();
  } else {
    let newName = req.body.name.toUpperCase();
    req.name = newName;
    next();
  }
}

userRouter.get('/', (req, res) => {
  userDb.get()
    .then(response => {
      response.forEach(res => {
        res.name = res.name.toUpperCase();
      })
      res.status(200).json(response)
    })
    .catch(err => res.status(400).json({error: "Could not retrieve users."}))
})

userRouter.post('/', Uppercase, (req, res) => {
  if(!req.body.name) {
    res.status(400).json({ error: "Need a user." })
  } else if(req.body.name.length > 129) {
    res.status(400).json({ error: "Too many characters in name. Needs to be less than 129."})
  } else {
    let { name } = req.body;
    const newUser = { name: req.name }
    console.log(newUser)
    userDb.insert(newUser)
      .then(response => {
        const send = {
          ...response,
          ...newUser
        }
        res.status(201).json(send)

     })
    .catch(err => res.status(400).json({ error: "User already exists." }));
  }
})

userRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  userDb.remove(id)
    .then(response => {
      if(!response) {
        res.status(404).json({ error: "No user with this id." })
      } else {
        res.status(200).json({ message: "Success!"})
      }
    })
    .catch(err => res.status(400).json({ error: "Bad request." }))
})


userRouter.put('/:id', validate, Uppercase, (req, res) => {
   const { id } = req.params;
   const { name } = req.body;
   const newUser = { name: req.name }
   userDb.update(id, newUser)
     .then(response => {
       if(!response) {
         res.status(400).json({ error: "Wrong id was given"})
       } else {
         res.status(200).json({message: "Success!"})
       }
     })
     .catch(err => res.status(400).json({ error: err }))
  })

  module.exports = userRouter;

