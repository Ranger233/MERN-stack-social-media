// Handles getting JSON web token for authentication
const express = require('express')
const router = express.Router()

// @route request type:GET, endpoint:api/auth
// @description: Test route
// @access: public
router.get('/', (req, res) => {
  res.send("GET request on auth route received")
})

module.exports = router