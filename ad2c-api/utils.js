
module.exports = {
  hash (target) {
    const hash = require('crypto').createHash('sha256')
    hash.update(target)
    return hash.digest('hex')
  },

  readFileAsync (file) {
    return new Promise((resolve, reject) => {
      require('fs').readFile(file, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  },

  writeFileAsync (file, content) {
    return new Promise((resolve, reject) => {
      require('fs').writeFile(file, content, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  },

  readdirAsync (path) {
    return new Promise((resolve, reject) => {
      require('fs').readdir(path, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  },

  statAsync (path) {
    return new Promise((resolve, reject) => {
      require('fs').stat(path, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  },

  unlinkAsync (path) {
    return new Promise((resolve, reject) => {
      require('fs').unlink(path, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  },

  async removeContentDirectory (target) {
    try {
      const files = await this.readdirAsync(target)
      for (let file of files) {
        const filePath = require('path').join(target, file)
        const stat = await this.statAsync(filePath)
        if (stat.isFile(filePath)) {
          await this.unlinkAsync(filePath)
        } else {
          this.removeContentDirectory(filePath)
        }
      }
    } catch (err) {
      console.log(err)
    }
  },

  async encodeBase64 (file) {
    try {
      const data = await this.readFileAsync(file)
      return Buffer.from(data).toString('base64')
    } catch (err) {
      return err
    }
  }
}
