// This file handles registering users, adding users...
const express = require('express')
const { check, validationResult } = require('express-validator')
const User = require('../../models/Users') // "User" is a MongoDB collection
const gravatar = require('gravatar') // a package to get avatar according to email address
const bcrypt = require('bcryptjs') // a package to encrypt password (We want to save encrypted password in database)
const jwt = require('jsonwebtoken') // After user registers, this package allows them to log in automatically without reentering password
const config = require('config')

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

  async (req, res) => { // Label this function to be "async" in order to use "await" in this function
  const errors = validationResult(req);
  // if there is an error in name/email/password
  if (!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() }) // 400:bad request
  }

  // destructure the "req.body" object, so we can write "name" instead of "req.body.name"
  const { name, email, password } = req.body 

  try{
    // Make a query in MongoDB, to see if the user exists (shouldn't register a existing user)
    let user = await User.findOne({email})
    if (user){
      return res.status(400).json({errors: [{ msg: 'User already exists' }]})
    }

    // Get user's gravatar according to his email
    const avatar = gravatar.url(email, {
      s:'200', //size
      r:'pg', // rating: no naked people
      d:'mm' // default: if the user doesn't have a gravatar, use a default image called 'mm'
    })

    user = new User({
      name,
      email,
      avatar,
      password
    })

    // Encrypt(hash) the password 
    //(Always put await in front of a function that returns a promise)
    const salt = await bcrypt.genSalt() // Generate "salt"
    user.password = await bcrypt.hash(password, salt) // save the hashed password into user object

    // Save the newly registered (created) user info into database
    await user.save()

    // Return jsonwebtoken
    const payload = {
      user:{
        id: user.id
      }
    }

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360011 }, // option
      (err, token) => {
        if(err) throw err;
        res.json({ token }) // send token back to user, so he can access protected route with it later
      }
    )

  } catch(err) {
    console.error(err.message);
    res.status(500).send('server error')
  }
  
})

module.exports = router