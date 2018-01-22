import {test} from 'ava'

import WebSocket from 'ws'
import gdax from './gdax'

global.WebSocket = WebSocket

test('products', async t => {
  const result = await gdax.products()
  const productIds = result.map(_ => _.id)
  console.log(productIds.sort())
  t.deepEqual(productIds.sort(), ['BCH-BTC', 'BCH-USD', 'BTC-EUR', 'BTC-GBP', 'BTC-USD', 'ETH-BTC', 'ETH-EUR', 'ETH-USD', 'LTC-BTC', 'LTC-EUR', 'LTC-USD'])
})

test('candles', async t => {
  const result = await gdax.candles()
  t.is(result.length, 30)
})

test('ticker', async t => {
  const result = await gdax.ticker('BCH', 'USD')
  t.is(result.product_id, 'BCH-USD')
})
