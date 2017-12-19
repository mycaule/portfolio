const moment = require('moment')
const coinbase = require('./services/coinbase')
const gdax = require('./services/gdax')

const $ = s => document.querySelector(s)

const openTab = sectionName => {
  const sections = document.getElementsByClassName('section')

  for (let i = 0; i < sections.length; i++) {
    sections[i].style.display = 'none'
  }
  document.getElementById(sectionName).style.display = 'block'
}

const barItems = document.getElementsByClassName('w3-bar-item')

for (let i = 0; i < barItems.length; i++) {
  barItems[i].onclick = () => openTab(barItems[i].innerHTML)
}

const initHTMLFields = (base, currency, basesRef, currenciesRef) => {
  const removeAll = selectbox => {
    for(let i=selectbox.options.length-1; i>=0; i--) {
      selectbox.remove(i)
    }
  }

  const currencies = $('select[property=\'currency\']')
  const bases = $('select[property=\'base\']')

  removeAll(currencies)
  removeAll(bases)

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

const check = () => {
  const selCurrency = $('select[property=\'currency\']').value
  const selBase = $('select[property=\'base\']').value

  console.log('checking coinbase for fresh data')
  coinbase.spot(selCurrency).then(res => {
    console.log('checking spot')
    const price = parseFloat(res.find(elt => elt.base === selBase).amount, 'us')
    $('meta[property=\'spot\']').content = price

    coinbase.historic('year', selBase, selCurrency).then(res => {
      console.log('checking year historic')
      const prices52w = res.prices.map(x => parseFloat(x.price, 'us'))
      const min = prices52w.reduce((a, b) => Math.min(a, b))
      const max = prices52w.reduce((a, b) => Math.max(a, b))
      $('meta[property=\'min52w\']').content = min
      $('meta[property=\'max52w\']').content = max
      $('meter[property=\'range52w\']').value = price
    })

    $('meta[property=\'checked_time\']').content = moment().format('H:mm:ss')
    $('meta[property=\'checked_date\']').content = moment().format('MM/DD/YYYY')
  })

  coinbase.historic('week', selBase, selCurrency).then(res => {
    console.log('checking week historic')
    const twoDaysAgo = moment(res.prices[0].time).startOf('day').subtract(1, 'days')
    const prices2d = res.prices.filter(x => moment(x.time).diff(twoDaysAgo) >= 0).reverse()

    $('meta[property=\'open1d\']').content = parseFloat(prices2d[0].price, 'us')

    import('./modules/charts').then(charts => charts.draw(prices2d))
  })

  console.log('checking gdax for fresh data')
  gdax.candles(selBase, selCurrency).then(res => {
    $('meta[property=\'vol1d\']').content = `${(res[0].volume/1000).toFixed(2)} M`
    $('meta[property=\'avg_vol30d\']').content = `${(res.slice(0,30).reduce((acc, x) => acc+x.volume, 0)/1000).toFixed(2)} M`
    console.log('gdax', res)
  })
}

document.addEventListener('mv-change', evt => {
  console.log(evt.action, evt.property, evt.value)

  if (evt.action === 'propertychange') {
    if (evt.property === 'base') {
      check()
    }

    if (evt.property === 'currency') {
      check()
    }
  }
})

initHTMLFields('BTC', 'EUR',
  [{text: 'BITCOIN', value: 'BTC'}, {text: 'ETHEREUM', value: 'ETH'}, {text: 'LITECOIN', value: 'LTC'}],
  [{text: 'EURO', value: 'EUR'}, {text: 'US DOLLAR', value: 'USD'}])

check()
