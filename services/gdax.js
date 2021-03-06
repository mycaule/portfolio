/* eslint new-cap: "off" */
/* eslint camelcase: "off" */

import axios from 'axios'
import {struct} from 'superstruct'
import {format, subDays} from 'date-fns'

const gdax = axios.create({
  baseURL: 'https://api.gdax.com'
})

const Base = struct.enum(['BTC', 'ETH', 'LTC', 'BCH', 'ETC', 'ZRX'])
const Currency = struct.enum(['EUR', 'USD'])

const ProductId = struct.enum(['BCH-BTC', 'BCH-EUR', 'BCH-USD', 'BCH-GBP', 'BTC-EUR', 'BTC-GBP', 'BTC-USD', 'ETC-BTC', 'ETC-EUR', 'ETC-USD', 'ETC-GBP', 'ETH-BTC', 'ETH-EUR', 'ETH-USD', 'ETH-GBP', 'LTC-BTC', 'LTC-EUR', 'LTC-USD', 'LTC-GBP', 'ZRX-BTC', 'ZRX-EUR', 'ZRX-USD'])

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
  product_id: ProductId,
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

const products = () =>
  gdax.get('/products').then(_ => _.data)

const candles = (b = 'BTC', c = 'EUR') => {
  const now = new Date()
  return gdax.get(`/products/${Base(b)}-${Currency(c)}/candles`, {
    params: {
      start: format(subDays(now, 30), 'YYYY-MM-DD'),
      end: format(now, 'YYYY-MM-DD'),
      granularity: 86400
    }
  }).then(_ =>
    RawCandles(_.data).map(x => {
      const [time, low, high, open, close, volume] = x
      const date = new Date(time * 1000)
      return Candle({time: format(date, 'YYYY-MM-DD'), low, high, open, close, volume})
    })
  )
}

const ticker = (b = 'BTC', c = 'EUR') =>
  new Promise((resolve, reject) => {
    const ws = new WebSocket('wss://ws-feed.gdax.com')

    ws.addEventListener('open', () => {
      try {
        const msg = {
          type: 'subscribe',
          product_ids: [
            ProductId(`${b}-${c}`)
          ],
          channels: ['ticker']
        }

        ws.send(JSON.stringify(msg))
      } catch (error) {
        reject(error)
      }
    })

    ws.addEventListener('close', () => console.log('gdax', 'disconnect'))

    ws.addEventListener('message', msg => {
      const data = struct.union([Ticker, Subscriptions])(JSON.parse(msg.data))

      if (data.type === 'ticker') {
        ws.close()
        resolve(data)
      }
    })

    ws.addEventListener('error', err => reject(err))
  })

export default {products, candles, ticker}
