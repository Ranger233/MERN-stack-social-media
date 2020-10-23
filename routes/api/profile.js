// fetching, adding, updating profiles
const express = require('express')
const router = express.Router()

// @route request type:GET, endpoint:api/profile
// @description: Test route
// @access: public
router.get('/', (req, res) => {
  res.send("GET request on profile route received")
})

module.exports = router