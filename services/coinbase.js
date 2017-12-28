/* eslint new-cap: "off" */

import axios from 'axios'
import {struct} from 'superstruct'

const coinbase = axios.create({
  baseURL: 'https://api.coinbase.com/v2',
  timeout: 3000
})

const bases = [{text: 'Bitcoin', value: 'BTC'}, {text: 'Ethereum', value: 'ETH'}, {text: 'Litecoin', value: 'LTC'}, {text: 'BCash', value: 'BCH'}]
const currencies = [{text: 'Euro', value: 'EUR'}, {text: 'US Dollar', value: 'USD'}]

const Base = struct.enum(bases.map(x => x.value))
const Currency = struct.enum(currencies.map(x => x.value))

const Amount = struct('string')
const Time = struct('string')
const Period = struct.enum(['hour', 'day', 'week', 'month', 'year', 'all'])

const Spots = struct([{
  base: Base,
  currency: Currency,
  amount: Amount
}])

const Prices = struct({
  currency: Currency,
  prices: [{
    price: Amount,
    time: Time
  }]
})

const spot = (c = `EUR`) => coinbase.get(`/prices/${Currency(c)}/spot`).then(resp => Spots(resp.data.data))

const historic = (p = 'year', b = 'BTC', c = 'EUR') =>
  coinbase.get(`/prices/${Base(b)}-${Currency(c)}/historic`, {
    params: {
      period: Period(p)
    }
  }).then(resp => Prices(resp.data.data))

const reference = () => {
  return {bases, currencies}
}

export default {spot, historic, reference}
