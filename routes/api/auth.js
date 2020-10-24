// Handles getting JSON web token for authentication
const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/Users')

// @route request type:GET, endpoint:api/auth
// @description: Test route
// @access: public

// The second argument "auth" is a middleware used to validate users token
// By adding this middleware, this route is now protected(only the user who has correct token can access it)
router.get('/', auth, async(req, res) => { 
  try {
    // find user's info(name, email, avatar...except password) in database according to req.user.id, and save them in "user"
    const user = await User.findById(req.user.id).select('-password')

    // and send it back to client-side in json format (these info will be needed in frontend to render something)
    res.json(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('server error')
  } 
})

module.exports = router