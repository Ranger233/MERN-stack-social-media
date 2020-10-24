const jwt = require('jsonwebtoken')
const config = require('config')

// a middleware function has access to req and res, and calling "next()" function means "move on to next middleware"
module.exports = function(req, res, next){
  //get token from the header of request (when sending request to a protected route, we need to inclucde the token in header)
  const token = req.header('x-auth-token') // what inside header is a bunch of key-value pairs, like 'x-auth-token':token

  // if there's no token
  if(!token){
    return res.status(401).json({ msg:'No token, authorization denied' })
  }

  //verify the token
  try{
    const decoded = jwt.verify(token, config.get('jwtSecret'))

    req.user = decoded.user 
    next() // 验证成功
  }catch(err){
    res.status(401).json({ msg:"Token is not valid" })
  }

}