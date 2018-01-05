import test from 'ava'

import coincap from './coincap'

test('global', async t => {
  const result = await coincap.global()
  console.log(result)
  t.true(true)
})

test('front', async t => {
  const result = await coincap.front()
  console.log(result)
  t.is(result.length, 5)
})
