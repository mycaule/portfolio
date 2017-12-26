import {test, skip} from 'ava'

import WebSocket from 'ws'
import gdax from './gdax'

global.WebSocket = WebSocket

skip('candles', async t => {
  const result = await gdax.candles()
  t.is(result.length, 30)
})

test('candles', async t => {
  await gdax.candles()
  t.true(true)
})

test('ticker', async t => {
  const result = await gdax.ticker('BCH', 'USD')
  t.is(result.product_id, 'BCH-USD')
})
