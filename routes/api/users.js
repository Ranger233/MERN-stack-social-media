// This file handles registering users, adding users...
const express = require('express')
const { check, validationResult } = require('express-validator/check')

const router = express.Router()

// @route request type: POST, endpoint:api/users
// @description: register users
// @access: public
router.post('/',
  [ // Use express-validator to check input before creating a new user
    check('name', 'Please enter your name')
      .not().isEmpty(),
    check('email', 'Please enter a valid email address')
      .isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
      .isLength({ min: 6 })
  ],
  (req, res) => {
  const errors = validationResult(req);
  // if there is an error
  if (!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() })
  }


  res.send(req.body)
})

module.exports = router