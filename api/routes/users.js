const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/user');
const { userLogger } = require('../config/logger');

router.post('/signup', (req, res) => {
  userLogger.info('Received create user request', { email: req.body.email });
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    const user = User({
      email: req.body.email,
      password: hash      
    });
    user
      .save()
      .then(result => {
        userLogger.info('User successfully created');
        res.status(201).json({
          message: 'User created',
        });
      })
      .catch(err => {
        userLogger.error(`Error creating user`, { error: err});
        res.status(400).json({
          error: err,
        });
      }); 
  });
});

router.post('/login', (req, res) => {
  console.log('process.env.SS_SECRET', process.env.SS_SECRET);
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(400).json({
          error: 'Authentication failed',
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            error: 'Authentication failed',
          })
        }
        if (result) {
          const token = jwt.sign({
              email: user.email
            },
            process.env.SS_SECRET,
            {
              expiresIn: '1h',
            },
          )
          return res.status(200).json({
            message: 'Auth success',
            token,
          })
        }
        if (!result) {
          return res.status(401).json({
            error: 'Authentication failed',
          })
        }
      })
    })
    .catch()
})

module.exports = router;
