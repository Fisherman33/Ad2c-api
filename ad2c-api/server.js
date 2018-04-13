const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes/router.js')
const database = require('./database.js')
const account = require('./account/manager.js')

const success = '\x1b[32mOK\x1b[0m'
const failure = '\x1b[31mFAILED\x1b[0m'
const ad2cApi = '[\x1b[35mAD2C\x1b[0m] '

const app = express()

// Port setting
const port = process.env.PORT || 3000

// Enable all CORS request
app.use(cors())
// Allows nested object
app.use(bodyParser.urlencoded({extended: true}))
// Parses incoming request bodies in a middleware
app.use(bodyParser.json())
// Allow cross domain scripting
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "Content-Type")
  response.header("Access-Control-Allow-Headers", "X-Requested-With")
  next()
})

// Account management
app.post('/api.ad2c/register', account.register)
app.post('/api.ad2c/authorize', account.authorize)
app.delete('/api.ad2c/delete', account.delete)

// Middlewares
// Ensures that all requests starting with /api.ad2c/* will be checked
// for the token
app.all('/api.ad2c/*', [require('./middleware/token')])

// Mounts the router as middleware at path "/"
app.use('/', router)

database.connect()
  .then(() => {
    console.log(`${ad2cApi}Connection to the database [${success}]`)
    database.init()
      .then(() => {
        app.listen(port, () => {
          console.log(`${ad2cApi}Listening on port ${port} [${success}]`)
          console.log(`${ad2cApi}ad2c starting service [${success}]`)
        })
      })
      .catch(err => {
        console.log(`${ad2cApi}ad2c starting service [${failure}]`)
        console.log(err.message)
        database.close()
        process.exit(1)
      })
  })
  .catch(err => {
    if (err) {
      console.log(`${ad2cApi}Connection to the database [${failure}]`)
      console.log(err.message)
      process.exit(1)
    }
  })
