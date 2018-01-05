/* eslint new-cap: "off" */

import axios from 'axios'
import {struct} from 'superstruct'

const coincap = axios.create({
  baseURL: 'https://coincap.io',
  timeout: 3000
})

const GlobalData = struct({
  altCap: 'number',
  bitnodesCount: 'number',
  btcCap: 'number',
  btcPrice: 'number',
  dom: 'number',
  totalCap: 'number',
  volumeAlt: 'number',
  volumeBtc: 'number',
  volumeTotal: 'number'
})

const FrontData = struct([{
  cap24hrChange: 'number',
  long: 'string',
  mktcap: 'number',
  perc: 'number',
  price: 'number',
  shapeshift: 'boolean',
  short: 'string',
  supply: 'number',
  usdVolume: 'number',
  volume: 'number',
  vwapData: 'number',
  vwapDataBTC: 'number'
}])

const global = () =>
  coincap.get('/global').then(res => GlobalData(res.data))

const front = () =>
  coincap.get('/front').then(res => FrontData(res.data.slice(0, 5)))

export default {global, front}
