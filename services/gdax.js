/* eslint new-cap: "off" */

const axios = require('axios')
const S = require('superstruct')
const moment = require('moment')

const gdax = axios.create({
  baseURL: 'https://api.gdax.com',
  timeout: 3000
})

const Base = S.struct.enum(['BTC', 'ETH', 'LTC'])
const Currency = S.struct.enum(['EUR', 'USD'])

const RawCandles = S.struct([
  ['number', 'number', 'number', 'number', 'number', 'number']
])

const Candle = S.struct({
  time: 'string',
  low: 'number',
  high: 'number',
  open: 'number',
  close: 'number',
  volume: 'number'
})

const candles = (b = 'BTC', c = 'EUR') =>
  gdax.get(`/products/${Base(b)}-${Currency(c)}/candles`, {
    params: {
      granularity: 24 * 60 * 60
    }
  }).then(resp =>
      RawCandles(resp.data).map(x => {
        const [time, low, high, open, close, volume] = x
        return Candle({time: moment.unix(time).format('YYYY-MM-DD'), low, high, open, close, volume})
      })
    )

module.exports = {candles}
