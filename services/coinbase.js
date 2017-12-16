/* eslint new-cap: "off" */

const axios = require('axios')
const S = require('superstruct')

const coinbase = axios.create({
  baseURL: 'https://api.coinbase.com/v2',
  timeout: 3000
})

const Base = S.struct.enum(['BTC', 'ETH', 'LTC'])
const Currency = S.struct.enum(['EUR', 'USD'])
const Amount = S.struct('string')
const Time = S.struct('string')
const Period = S.struct.enum(['hour', 'day', 'week', 'month', 'year', 'all'])

const Spots = S.struct([{
  base: Base,
  currency: Currency,
  amount: Amount
}])

const Prices = S.struct({
  currency: Currency,
  prices: [{
    price: Amount,
    time: Time
  }]
})

const spot = (c = `EUR`) => coinbase.get(`/prices/${Currency(c)}/spot`).then(resp => Spots(resp.data.data))

const historic = (b = 'BTC', c = 'EUR', p = 'year') =>
  coinbase.get(`/prices/${Base(b)}-${Currency(c)}/historic`, {
    params: {
      period: Period(p)
    }
  }).then(resp => Prices(resp.data.data))

const reference = () => [Base, Currency]

module.exports = {spot, historic, reference}
