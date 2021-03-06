const jwt = require('jsonwebtoken')
const utils = require('../utils.js')
const database = require('../database.js')

const account = {

  async register (request, response, next) {
    const db = database.get()

    if (request.body.username === undefined ||
        request.body.password === undefined) {
      return response.status(412).json({
        status: 412,
        success: false,
        message: 'Body missing username/password field(s)'
      })
    }

    try {
      const doc = await db.collection('users').findOne(
        {
          username: request.body.username
        })

      if (doc) {
        return response.status(409).json({
          status: 409,
          success: false,
          message: `Conflict: ${doc.username} already used`
        })
      }

      await db.collection('users').insertOne(
        {
          username: request.body.username,
          password: utils.hash(request.body.password)
        })

      return response.status(201).json({
        status: 201,
        success: true,
        message: 'Account registrated successfully'
      })
    } catch (err) {
      next(err)
    }
  },

  async authorize (request, response, next) {
    const db = database.get()

    if (request.body.username === undefined ||
        request.body.password === undefined) {
      return response.status(412).json({
        status: 412,
        success: false,
        message: 'Body missing username/password field(s)'
      })
    }

    try {
      const doc = await db.collection('users').findOne(
        {
          username: request.body.username,
          password: utils.hash(request.body.password)
        })

      if (doc) {
        const payload = {username: doc.username, userId: doc._id}
        const newToken = await jwt.sign(payload, '1S3cR€T!', {expiresIn: '24h'})
        return response.status(200).json({
          status: 200,
          success: true,
          token: newToken
        })
      }

      return response.status(401).json({
        status: 401,
        success: false,
        message: 'Wrong credentials'
      })
    } catch (err) {
      next(err)
    }
  },

  async delete (request, response, next) {
    const db = database.get()

    if (request.body.username === undefined ||
        request.body.password === undefined) {
      return response.status(412).json({
        status: 412,
        success: false,
        message: 'Body missing username/password field(s)'
      })
    }

    try {
      const doc = await db.collection('users').findOneAndDelete(
        {
          username: request.body.username,
          password: utils.hash(request.body.password)
        })

      if (doc && doc.value !== null) {
        return response.status(200).json({
          status: 200,
          success: true,
          message: 'Account deleted successfully'
        })
      }

      return response.status(401).json({
        status: 401,
        success: false,
        message: 'Wrong credentials'
      })
    } catch (err) {
      next(err)
    }
  }

}

module.exports = account
