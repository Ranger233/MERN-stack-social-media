// Create user data schema
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  avatar:{
    type: String
  },
  date:{
    type: Date,
    default: Date.now
  }
})

// Create a mongoDB collection called User, using userSchema defined above
module.exports = User = mongoose.model('User', userSchema)