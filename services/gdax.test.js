import test from 'ava'

import gdax from './gdax'

test('candles', async t => {
  const result = await gdax.candles()
  t.is(result.length, 30)
})
