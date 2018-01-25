/* eslint new-cap: "off" */
/* eslint camelcase: "off" */

import axios from 'axios'
import {struct} from 'superstruct'

const RSS = struct({
  status: struct.enum(['ok']),
  feed: 'object',
  items: [{
    title: 'string',
    pubDate: 'string',
    link: 'string',
    guid: 'string',
    author: 'string',
    thumbnail: 'string',
    description: 'string',
    content: 'string',
    enclosure: 'object',
    categories: ['string']
  }]
})

const rss2json = axios.create({
  baseURL: 'https://api.rss2json.com/v1',
  timeout: 3000
})

const convert = (rss_url, api_key = 'vxpi1cepzbxaynyujtsmcihuqgorwqp06demjtah') =>
  rss2json.get('/api.json', {
    params: {
      rss_url,
      api_key
    }
  }).then(_ => RSS(_.data))

export default {convert}
