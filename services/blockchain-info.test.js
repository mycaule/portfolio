import test from 'ava'

import blockchain from './blockchain-info'

test('spot', async t => {
  const result = await blockchain.users()
  t.is(result.length, 7)
})
