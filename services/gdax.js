/* eslint new-cap: "off" */

import axios from 'axios'
import {struct} from 'superstruct'
import {parse, format, subDays} from 'date-fns'

const gdax = axios.create({
  baseURL: 'https://api.gdax.com'
})

const Base = struct.enum(['BTC', 'ETH', 'LTC', 'BCH'])
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

const candles = (b = 'BTC', c = 'EUR') => {
  const now = new Date()
  return gdax.get(`/products/${Base(b)}-${Currency(c)}/candles`, {
    params: {
      start: format(subDays(now, 30), 'YYYY-MM-DD'),
      end: format(now, 'YYYY-MM-DD'),
      granularity: 24 * 60 * 60
    }
  }).then(resp => {
    RawCandles(resp.data).map(x => {
      const [time, low, high, open, close, volume] = x
      return Candle({time: format(parse(time), 'YYYY-MM-DD'), low, high, open, close, volume})
    })
  })
}

export default {candles}
