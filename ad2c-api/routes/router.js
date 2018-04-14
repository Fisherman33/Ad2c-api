const express = require('express')
const multer = require('multer')
const upload = multer({ dest: '.uploads/' })
const router = new express.Router()

// Routes handlers
const news = require('./news.js')
const quotations = require('./quotations.js')

//
// Routing
//

// Frist path handled
router.get('/api.ad2c', (request, response, next) => {
  response.status(200).json({
    status: 200,
    success: true,
    message: 'Welcome to the AD2C-API'
  })
})

router.get('/api.ad2c/news', news.getAll)
router.get('/api.ad2c/news/:id', news.getOne)
router.post('/api.ad2c/news', upload.single('file'), news.create)
router.delete('/api.ad2c/news/:id', news.delete)

// If no route is matched a '404 Not Found' error is returned.
router.use(require('../middleware/error.js').notFound)

// Error middleware to catch unexpected errors
router.use(require('../middleware/error.js').errorHandler)

module.exports = router
