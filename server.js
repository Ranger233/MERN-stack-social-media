const express = require('express')
const connectDB = require('./config/db')

const app = express()

// Connect database, 这个函数是定义在config/db.js里的
connectDB()

// Init middleware. in order to have access to "req.body" from POST request
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API running'))

// Define routes
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/users', require('./routes/api/users'))

// process.env.PORT will look for an environment varible called PORT (used to deploy in Heroku), if it's not found, PORT=5000
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Server started on port ${PORT}'))

