const express = require('express')

const app = express()

app.get('/', (req, res) => res.send('API running'))


// process.env.PORT will look for an environment varible called PORT (used to deploy in Heroku), if it's not found, PORT=5000
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Server started on port ${PORT}'))

