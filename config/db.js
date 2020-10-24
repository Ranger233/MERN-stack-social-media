// We will make connection to database in this file
const mongoose = require('mongoose')
const config = require('config')

// Use config.get() to get values defined in default.json
const db = config.get('mongoURI')

// define the function to connect to the database
const connectDB = async () => {
  try {
    // connect to the Mongo cloud database according to the URI
    await mongoose.connect(db, { 
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    })

    console.log("MongoDB connected...")
  }catch(err){
    console.error(err.message)
    // Exit process with failure
    process.exit(1)
  }
}

module.exports = connectDB
