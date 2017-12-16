/* global Mavo */
// const v = require('voca')
const moment = require('moment')
const echarts = require('echarts')

const coinbase = require('./services/coinbase')

const $ = s => document.querySelector(s)

const initHTMLFields = (base, currency, basesRef, currenciesRef) => {
  const currencies = $('select[property=\'currency\']')
  const bases = $('select[property=\'base\']')

  basesRef.forEach(elt => {
    const opt1 = document.createElement('option')
    opt1.text = elt
    opt1.value = elt
    bases.add(opt1)
  })

  currenciesRef.forEach(elt => {
    const opt2 = document.createElement('option')
    opt2.text = elt
    opt2.value = elt
    currencies.add(opt2)
  })

  currencies.value = currency
  bases.value = base
}

const drawChart = (base, currency) => {
  const myChart = echarts.init($('#myChart'))
  console.log(myChart)

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
    const price = res.find(elt => elt.base === selBase).amount
    console.log(price)
    $('input[property=\'spot\']').value = price

    $('input[property=\'checked_time\']').value = moment().format('H:mm:ss')
    $('input[property=\'checked_date\']').value = moment().format('MM/DD/YYYY')
  })
}

Mavo.Functions.onchange = (base, currency) => {
  if (base || currency) {
    console.log('--changing')
    lookupSpot()
    drawChart(base, currency)
  }
  return `${base} ${currency}`
}

coinbase.historic().then(res => console.log(res))

initHTMLFields('BTC', 'EUR', ['BTC', 'ETH', 'LTC'], ['EUR', 'USD'])

drawChart('BTC', 'EUR')
