require('dotenv').config();

const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV || "development";
const express = require('express')
const app = express()
const morgan = require('morgan');

//init of program use
app.use(morgan('dev'));

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get('/a', (req, res) => {
  res.send('Hello!')
})

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})