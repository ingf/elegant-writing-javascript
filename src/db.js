import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.connection.on('open', () => {
  console.log('Connected to mongo server.')
})
mongoose.connection.on('error', err => {
  console.log('Error connected to mongo server!')
  console.log(err)
})
mongoose.connect('mongodb://localhost:27017/test')
