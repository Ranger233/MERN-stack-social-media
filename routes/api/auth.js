// Handles getting JSON web token for authentication
const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/Users')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

// @route    GET  api/auth
// @desc     get user info
// @access   private

// The second argument "auth" is a middleware used to validate users token
// By adding this middleware, this route is now protected(only the user who has correct token can access it)
router.get('/', auth, async(req, res) => { 
  try {
    // This function find user's info(name, email, avatar...except password) in database according to req.user.id, and save them in "user"
    const user = await User.findById(req.user.id).select('-password')

    // and send it back to client-side in json format (these info will be needed in frontend to render something)
    res.json(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('server error')
  } 
})


// @route   POST  api/users
// @desc    log in users. If the password is right, return a token, so the user can access protected route with his token
// @access  public
router.post('/',
  [ // Use express-validator to check input
    check('email', 'Please enter a valid email address')
      .isEmail(),
    check('password', 'Please enter a password')
      .exists()
  ],

  async (req, res) => { 
  const errors = validationResult(req);
  // if there is an error in name/email/password
  if (!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() }) // 400:bad request
  }

  const { email, password } = req.body 

  try{
    // Make a query in MongoDB, to check if the user exists. If he exists, his document in DB will be saved in "user" object
    let user = await User.findOne({email})
    if (!user){
      return res.status(400).json({errors: [{ msg: "User doesn't exist" }]})
    }

    // check if password is correct("password" is input from client side, "user.password" is the correct password in DB)
    // "bcrypt.compare" compares a plain text password and a encrypted password(password in DB are encrypted)
    //It returns a promise, so we add "await" in front of it 
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      res.status(400).json({errors: [{ msg:'incorrect password' }] })
    }

    // If the password is right, return jsonwebtoken(which contains user ID), so the user can access protected route with his token
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