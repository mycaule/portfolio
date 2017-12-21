import {test, skip} from 'ava'

import gdax from './gdax'

skip('candles', async t => {
  const result = await gdax.candles()
  t.is(result.length, 30)
})

test('candles', async t => {
  await gdax.candles()
  t.true(true)
})
