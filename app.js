import moment from 'moment'
import coinbase from './services/coinbase'
import gdax from './services/gdax'
import charts from './modules/charts'

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

const initHTMLFields = () => {
  const ref = coinbase.reference()

  const removeAll = selectbox => {
    for (let i = selectbox.options.length - 1; i >= 0; i--) {
      selectbox.remove(i)
    }
  }

  const currencies = $('select[property=\'currency\']')
  const bases = $('select[property=\'base\']')

  removeAll(currencies)
  removeAll(bases)

  ref.bases.forEach(elt => {
    const opt1 = document.createElement('option')
    opt1.text = elt.text
    opt1.value = elt.value
    bases.add(opt1)
  })

  ref.currencies.forEach(elt => {
    const opt2 = document.createElement('option')
    opt2.text = elt.text
    opt2.value = elt.value
    currencies.add(opt2)
  })

  // Currencies.value = currency
  // bases.value = base
}

const check = () => {
  const selCurrency = $('select[property=\'currency\']').value
  const selBase = $('select[property=\'base\']').value

  console.log('checking coinbase...')
  coinbase.spot(selCurrency).then(res => {
    const price = parseFloat(res.find(elt => elt.base === selBase).amount, 'us')
    $('meta[property=\'spot\']').content = price

    coinbase.historic('year', selBase, selCurrency).then(res => {
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
    const twoDaysAgo = moment(res.prices[0].time).startOf('day').subtract(1, 'days')
    const prices2d = res.prices.filter(x => moment(x.time).diff(twoDaysAgo) >= 0).reverse()

    const [last] = prices2d.slice(-1)
    const oneDayAgo = moment(last.time).startOf('day')
    const times = prices2d.map(x => x.time)
    const prices1 = prices2d.filter(x => moment(x.time).diff(oneDayAgo) >= 0)
    const prices2 = prices2d.filter(x => moment(x.time).diff(oneDayAgo) < 0)

    charts.draw(times, prices1, prices2)

    $('meta[property=\'open1d\']').content = parseFloat(prices1[0].price, 'us')
  })

  console.log('checking gdax...')
  gdax.candles(selBase, selCurrency).then(res => {
    $('meta[property=\'vol1d\']').content = `${(res[0].volume / 1000).toFixed(2)} M`
    $('meta[property=\'avg_vol30d\']').content = `${(res.slice(0, 30).reduce((acc, x) => acc + x.volume, 0) / 1000).toFixed(2)} M`
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

initHTMLFields()

check()
