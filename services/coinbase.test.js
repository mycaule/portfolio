import test from 'ava'

import coinbase from './coinbase'

test('spot', async t => {
  const result = await coinbase.spot()
  t.is(result.length, 7)
})

test('historic', async t => {
  const result = await coinbase.historic()
  t.true(result.prices.length > 100)
})

test('reference', t => {
  const ref = coinbase.reference()
  t.is(ref.bases.length, 7)
  t.is(ref.currencies.length, 2)
})
