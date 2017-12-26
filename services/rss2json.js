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
    enclosure: ['string'],
    categories: ['string']
  }]
})

const rss2json = axios.create({
  baseURL: 'https://api.rss2json.com/v1',
  timeout: 3000
})

const convert = rss_url =>
  rss2json.get('/api.json', {
    params: {
      rss_url
    }
  }).then(_ => RSS(_.data))

export default {convert}
