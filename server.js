//server.js
import express from 'express';

let app = express();
let PORT = 3000;

app.post('/', (req, res) => {
  res.send('Hello!');
});

let server = app.listen(PORT, function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
