const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
  res.end()
})

const server = app.listen(3000, () => {
  console.log('Server stared at port 3000');
  
})