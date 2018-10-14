import {test} from 'ava'

import WebSocket from 'ws'
import gdax from './gdax'

global.WebSocket = WebSocket

test('products', async t => {
  const result = await gdax.products()
  const productIds = result.map(_ => _.id)
  t.deepEqual(productIds.sort(), ['BCH-BTC', 'BCH-EUR', 'BCH-GBP', 'BCH-USD', 'BTC-EUR', 'BTC-GBP', 'BTC-USD', 'ETC-BTC', 'ETC-EUR', 'ETC-GBP', 'ETC-USD', 'ETH-BTC', 'ETH-EUR', 'ETH-GBP', 'ETH-USD', 'LTC-BTC', 'LTC-EUR', 'LTC-GBP', 'LTC-USD', 'ZRX-BTC', 'ZRX-EUR', 'ZRX-USD'])
})

test('candles', async t => {
  const result = await gdax.candles()
  t.is(result.length, 30)
})

test('ticker', async t => {
  const result = await gdax.ticker('BCH', 'USD')
  t.is(result.product_id, 'BCH-USD')
})
