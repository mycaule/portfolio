/* eslint new-cap: "off" */

import axios from 'axios'
import {format} from 'date-fns'

const blockchain = axios.create({
  baseURL: 'https://api.blockchain.info/charts',
  timeout: 3000
})

const users = () =>
  blockchain.get('/my-wallet-n-users', {
    params: {
      cors: true,
      timespan: '1week'
    }
  }).then(res => {
    const objs = res.data.values.map(({x, y}) => {
      return [
        format(new Date(x * 1000), 'YYYY-MM-DD'),
        y
      ]
    })

    return [...new Map(objs)].map(([x, y]) => {
      return {
        date: x,
        count: y
      }
    })
  })

export default {users}
