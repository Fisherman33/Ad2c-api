const fs = require('fs')
const path = require('path')
const utils = require('../utils.js')
const mkdirp = require('async-mkdirp')
const database = require('../database.js')
const dir = path.join('.', '.uploads')

const news = {

  async getAll (request, response, next) {
    const db = database.get()

    try {
      const news = await db.collection('news').find().toArray()

      if (!news.length) {
        return response.status(404).json({
          status: 404,
          success: false,
          message: 'No news found'
        })
      }

      return response.status(200).json({
        status: 200,
        success: true,
        news: news
      })
    } catch (err) {
      next(err)
    }
  },

  async getOne (request, response, next) {
    const db = database.get()
    const ObjectId = require('mongodb').ObjectId

    try {
      const elem = await db.collection('news').findOne(
        {
          _id: ObjectId(request.params.id)
        })

      if (!elem) {
        return response.status(404).json({
          status: 404,
          success: false,
          message: 'elem not found'
        })
      }

      return response.status(200).json({
        status: 200,
        success: true,
        news: elem
      })
    } catch (err) {
      next(err)
    }
  },

  async create (request, response, next) {
    const db = database.get()
    const bucket = database.bucket()
    const ObjectId = require('mongodb').ObjectId

    if (typeof request.file === 'undefined') {
      return response.status(422).json({
        status: 422,
        success: false,
        message: 'Unprocessable entity'
      })
    }

    try {

      let news = {}
      let date = new Date()
      const items = await utils.readdirAsync(dir)
      const data = await fs.createReadStream(path.join(dir, items[0]))
        .pipe(bucket.openUploadStream(items[0]))
      news.date = `${date.getMonth()}-${date.getFullYear()}`
      news.fileId = data.id
      
      await db.collection('news').insertOne(
        {
          date: news.date,
          fileId: ObjectId(news.fileId)
        })
    
      return response.status(201).json({
        status: 201,
        success: true,
        message: 'News created successfully'
      })
    } catch (err) {
      next(err)
     } finally {
         await utils.removeContentDirectory(dir)
       }
  },

  async delete (request, response, next) {
    const db = database.get()
    const bucket = database.bucket()
    const ObjectId = require('mongodb').ObjectId

    try {
      const elem = await db.collection('news').findOne(
        {
          _id: ObjectId(request.params.id)
        })

      if (!elem) {
        return response.status(404).json({
          status: 404,
          success: false,
          message: 'News not found'
        })
      }

      const doc = await db.collection('news').findOneAndDelete(elem)

      if (doc && doc.value !== null) {
        return response.status(200).json({
          status: 200,
          success: true,
          message: 'News deleted successfully'
        })
      }

      return response.status(500).json({
        status: 500,
        success: false,
        message: 'An unexpected error occured during the deletion of the news'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = news
