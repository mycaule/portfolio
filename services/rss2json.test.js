import {test} from 'ava'

import rss2json from './rss2json'

test('convert', async t => {
  const result = await rss2json.convert('https://www.reddit.com/r/CryptoCurrency.rss')
  t.is(result.items.length, 20)
})
