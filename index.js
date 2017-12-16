const express = require('express')
const coinbase = require('./services/coinbase')

const app = express()
const port = process.env.PORT || 5005

app.use(express.static('public'))

app.get('/data/spot', (req, res) => {
  res.json(coinbase.spot())
})

app.get('/data/historic', (req, res) => {
  res.json(coinbase.historic())
})

app.listen(port)
