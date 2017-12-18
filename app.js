/* eslint import/no-unassigned-import: "off" */

const moment = require('moment')
// Const v = require('voca')

const echarts = require('echarts/lib/echarts')

// Include bar chart
require('echarts/lib/chart/line')

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

const drawChart = prices => {
  const chart = echarts.init($('#graphPerf2d'))

  // ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
  const option = {
    xAxis: [
      {
        data: prices.map(x => x.time),
        show: false
      }
    ],
    yAxis: [
      {
        type: 'value',
        min: 'dataMin',
        max: 'dataMax',
        show: false
      }
    ],
    series: [
      {
        name: 'D-1',
        type: 'line',
        data: prices.map(x => x.price),
        markLine: {
          data: [
            {type: 'average', name: 'avg price'}
          ]
        }
      },
      {
        name: 'D-2',
        type: 'line',
        data: prices.slice(0, 48).map(x => x.price),
        markLine: {
          data: [
            {type: 'average', name: 'avg price'}
          ]
        }
      }
    ]
  }

  chart.setOption(option)
}

const checkCoinbase = () => {
  const selCurrency = $('select[property=\'currency\']').value
  const selBase = $('select[property=\'base\']').value

  console.log('checking coinbase for fresh data')
  coinbase.spot(selCurrency).then(res => {
    const price = parseFloat(res.find(elt => elt.base === selBase).amount, 'us')
    $('input[property=\'spot\']').value = price

    coinbase.historic('year').then(res => {
      const prices52w = res.prices.map(x => parseFloat(x.price, 'us'))
      const min = prices52w.reduce((a, b) => Math.min(a, b))
      const max = prices52w.reduce((a, b) => Math.max(a, b))
      $('input[property=\'min52w\']').value = min
      $('input[property=\'max52w\']').value = max
      $('meter[property=\'range52w\']').value = price
    })

    $('input[property=\'checked_time\']').value = moment().format('H:mm:ss')
    $('input[property=\'checked_date\']').value = moment().format('MM/DD/YYYY')
  })

  coinbase.historic('week').then(res => {
    const prices2d = res.prices.slice(0, 96)
    const prices1d = prices2d.slice(0, 48).map(x => parseFloat(x.price, 'us'))
    const close1d = prices1d[0]
    const [open1d] = prices1d.slice(-1)
    $('input[property=\'close1d\']').value = close1d
    $('input[property=\'open1d\']').value = open1d
    drawChart(prices2d)
  })
}

document.addEventListener('mv-change', evt => {
  console.log(evt.action, evt.property, evt.value)

  if (evt.action === 'propertychange') {
    if (evt.property === 'base') {
      checkCoinbase()
    }

    if (evt.property === 'currency') {
      checkCoinbase()
    }
  }
})

initHTMLFields('BTC', 'EUR',
  [{text: 'BITCOIN', value: 'BTC'}, {text: 'ETHEREUM', value: 'ETH'}, {text: 'LITECOIN', value: 'LTC'}],
  [{text: 'EURO', value: 'EUR'}, {text: 'US DOLLAR', value: 'USD'}])

checkCoinbase()
