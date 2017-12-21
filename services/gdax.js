/* eslint new-cap: "off" */

import axios from 'axios'
import {struct} from 'superstruct'
import moment from 'moment'

const gdax = axios.create({
  baseURL: 'https://api.gdax.com',
  timeout: 3000
})

const Base = struct.enum(['BTC', 'ETH', 'LTC'])
const Currency = struct.enum(['EUR', 'USD'])

const RawCandles = struct([
  ['number', 'number', 'number', 'number', 'number', 'number']
])

const Candle = struct({
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
      start: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      granularity: 24 * 60 * 60
    }
  }).then(resp => {
    RawCandles(resp.data).map(x => {
      const [time, low, high, open, close, volume] = x
      return Candle({time: moment.unix(time).format('YYYY-MM-DD'), low, high, open, close, volume})
    })
  })

export default {candles}
