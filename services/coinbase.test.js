import test from 'ava'

import coinbase from './coinbase'

test('spot', async t => {
  const result = await coinbase.spot()
  t.is(result.length, 3)
})

test('historic', async t => {
  const result = await coinbase.historic()
  t.true(result.prices.length > 100)
})

test('reference', t => {
  const result = coinbase.reference()
  console.log(result)
  t.true(true)
})
