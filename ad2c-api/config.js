var config = {
  mongo: {
    auth: false,
    username: '',
    password: '',
    port: '27017',
    uri: process.env.MONGO_URI || 'localhost',
    database: 'ad2c-db'
  }
}

module.exports = config
