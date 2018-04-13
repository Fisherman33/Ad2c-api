const utils = require('../utils.js')
const database = require('../database.js')

const quotations = {
    
  async create (request, response, next) {
    const db = database.get()

    try {
      return response.status(201).json({
        status: 201,
        success: true,
        message: 'Quotation submitted successfully'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = quotations
