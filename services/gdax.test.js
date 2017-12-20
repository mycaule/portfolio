import test from 'ava'

import gdax from './gdax'

test('candles', async t => {
  const result = await gdax.candles()
  t.true(result.length > 100)
})
