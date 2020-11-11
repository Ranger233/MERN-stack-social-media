const express = require('express')
const connectDB = require('./config/db')
const path = require('path')

const app = express()

// Connect to database (defined in config/db.js)
connectDB()

// Init middleware. in order to have access to "req.body" from POST request
app.use(express.json({ extended: false }))

// Define routes
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/users', require('./routes/api/users'))

// Serve static assets in production
if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}


// process.env.PORT will look for an environment varible called PORT (used to deploy in Heroku), if it's not found, PORT=5000
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

