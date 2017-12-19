import test from 'ava'

import * as gdax from './gdax'

test('candles', async t => {
  const result = await gdax.candles()
  t.true(result.length > 100)
})
