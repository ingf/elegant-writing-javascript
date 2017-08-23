import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
})

export default mongoose.model('User', schema)
