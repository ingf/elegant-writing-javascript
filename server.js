// server.js
import express from 'express'

const app = express()
const PORT = 3000

app.post('/', (req, res) => {
  res.send('Hello!')
})

const server = app.listen(PORT, () => {
  const host = server.address().address
  const port = server.address().port

  console.log('Listening at http://%s:%s', host, port)
})
