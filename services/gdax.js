/* eslint new-cap: "off" */
/* eslint camelcase: "off" */

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

const Ticker = struct({
  type: struct.enum(['ticker']),
  sequence: 'number',
  product_id: struct.enum(['BTC-EUR', 'ETH-EUR', 'LTC-EUR', 'BCH-EUR', 'BTC-USD', 'ETH-USD', 'LTC-USD', 'BCH-USD']),
  price: 'string',
  open_24h: 'string',
  volume_24h: 'string',
  low_24h: 'string',
  high_24h: 'string',
  volume_30d: 'string',
  best_bid: 'string',
  best_ask: 'string',
  side: struct.optional(struct.enum(['sell', 'buy'])),
  time: 'string?',
  trade_id: 'number?',
  last_size: 'string?'
})

const Subscriptions = struct({
  type: struct.enum(['subscriptions']),
  channels: ['object']
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

const ticker = (base, currency) => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('wss://ws-feed.gdax.com')

    ws.onopen = () => {
      const msg = {
        type: 'subscribe',
        product_ids: [
          `${base}-${currency}`
        ],
        channels: ['ticker']
      }

      ws.send(JSON.stringify(msg))
    }

    ws.onclose = () => {
      console.log('gdax', 'disconnect')
    }

    ws.onmessage = msg => {
      const data = struct.union([Ticker, Subscriptions])(JSON.parse(msg.data))

      if (data.type === 'ticker') {
        ws.close()

        resolve(data)
      }
    }

    ws.onerror = err => {
      reject(err)
    }
  })
}

export default {candles, ticker}
