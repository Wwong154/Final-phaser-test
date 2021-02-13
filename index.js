const express = require('express')
const app = express()
const port = 3000

app.get('/a', (req, res) => {
  res.send('Hello!')
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})