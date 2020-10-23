const express = require('express')
const router = express.Router()

// @route request type:GET, endpoint:api/posts
// @description: Test route
// @access: public
router.get('/', (req, res) => {
  res.send("GET request on posts route received")
})

module.exports = router