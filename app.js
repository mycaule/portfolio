/* global Mavo, echarts */
const moment = require('moment')
// Const v = require('voca')
// const echarts = require('echarts')

const coinbase = require('./services/coinbase')

const $ = s => document.querySelector(s)

const initHTMLFields = (base, currency, basesRef, currenciesRef) => {
  const currencies = $('select[property=\'currency\']')
  const bases = $('select[property=\'base\']')

  basesRef.forEach(elt => {
    const opt1 = document.createElement('option')
    opt1.text = elt.text
    opt1.value = elt.value
    bases.add(opt1)
  })

  currenciesRef.forEach(elt => {
    const opt2 = document.createElement('option')
    opt2.text = elt.text
    opt2.value = elt.value
    currencies.add(opt2)
  })

  currencies.value = currency
  bases.value = base
}

const drawChart = () => {
  const myChart = echarts.init($('#myChart'))

  const option = {
    title: {
      text: 'ECharts entry example'
    },
    tooltip: {},
    legend: {
      data: ['Sales']
    },
    xAxis: {
      data: ['shirt', 'cardign', 'chiffon shirt', 'pants', 'heels', 'socks']
    },
    yAxis: {},
    series: [{
      name: 'Sales',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }]
  }

  myChart.setOption(option)
}

const lookupSpot = () => {
  const selCurrency = $('select[property=\'currency\']').value
  const selBase = $('select[property=\'base\']').value

  coinbase.spot(selCurrency).then(res => {
    const price = parseFloat(res.find(elt => elt.base === selBase).amount)
    $('input[property=\'spot\']').value = price

    coinbase.historic('year').then(res => {
      const prices52w = res.prices.map(x => parseFloat(x.price))
      const min = prices52w.reduce((a, b) => Math.min(a, b))
      const max = prices52w.reduce((a, b) => Math.max(a, b))
      $('input[property=\'min52w\']').value = min
      $('input[property=\'max52w\']').value = max
      $('input[property=\'range52w\']').value = price
    })

    $('input[property=\'checked_time\']').value = moment().format('H:mm:ss')
    $('input[property=\'checked_date\']').value = moment().format('MM/DD/YYYY')
  })

  coinbase.historic('week').then(res => {
    const prices2d = res.prices.map(x => parseFloat(x.price)).slice(0, 96)
    const prices1d = prices2d.slice(0, 48)
    const close1d = prices1d[0]
    const [open1d] = prices1d.slice(-1)
    $('input[property=\'close1d\']').value = close1d
    $('input[property=\'open1d\']').value = open1d
    $('input[property=\'performance2d\']').value = prices2d
  })
}

Mavo.Functions.onchange = (base, currency) => {
  if (base && currency) {
    console.log('Updating data...')
    lookupSpot()
    drawChart(base, currency)
  }
  return `${base} ${currency}`
}

initHTMLFields('BTC', 'EUR',
  [{text: 'BITCOIN', value: 'BTC'}, {text: 'ETHEREUM', value: 'ETH'}, {text: 'LITECOIN', value: 'LTC'}],
  [{text: 'EURO', value: 'EUR'}, {text: 'US DOLLAR', value: 'USD'}])

drawChart('BTC', 'EUR')
