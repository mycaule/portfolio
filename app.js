/* eslint import/no-unassigned-import: "off" */

import moment from 'moment'
import coinbase from './services/coinbase'
import gdax from './services/gdax'
import charts from './modules/charts'
import './modules/feed'

const $ = s => document.querySelector(s)

const openTab = sectionName => {
  const sections = document.getElementsByClassName('section')

  for (let i = 0; i < sections.length; i++) {
    sections[i].style.display = 'none'
  }
  document.getElementById(sectionName).style.display = 'block'
}

const tabItems = document.getElementsByClassName('tab-item')

for (let i = 0; i < tabItems.length; i++) {
  tabItems[i].onclick = () => {
    for (let j = 0; j < tabItems.length; j++) {
      tabItems[j].classList.remove('active')
    }

    tabItems[i].classList.toggle('active')
    openTab(tabItems[i].textContent)
  }
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
    const spot = parseFloat(res.find(elt => elt.base === selBase).amount, 'us')
    $('meta[property=\'spot\']').content = spot

    coinbase.historic('year', selBase, selCurrency).then(res => {
      const prices52w = res.prices.map(_ => parseFloat(_.price, 'us'))
      $('meta[property=\'min52w\']').content = Math.min(...prices52w)
      $('meta[property=\'max52w\']').content = Math.max(...prices52w)
      $('meta[property=\'avg52w\']').content = (prices52w.reduce((acc, val) => acc + val, 0) / prices52w.length).toFixed(2)
      $('meter[property=\'range52w\']').value = spot
    })

    $('meta[property=\'checked_time\']').content = moment().format('H:mm:ss')
    $('meta[property=\'checked_date\']').content = moment().format('MM/DD/YYYY')
  })

  coinbase.historic('week', selBase, selCurrency).then(res => {
    const oneDayAgo = moment(res.prices[0].time).startOf('day')
    const twoDaysAgo = moment(res.prices[0].time).startOf('day').subtract(1, 'days')

    const prices2d = res.prices.filter(_ => moment(_.time).diff(twoDaysAgo) >= 0).reverse()

    const times = prices2d.map(_ => _.time)
    const prices1 = prices2d.filter(_ => moment(_.time).diff(oneDayAgo) >= 0)
    const prices2 = prices2d.filter(_ => moment(_.time).diff(oneDayAgo) < 0)

    console.log('spot', $('meta[property=\'spot\']'))
    const spot = $('meta[property=\'spot\']').content
    charts.draw(times, spot, prices1, prices2)

    $('meta[property=\'open1d\']').content = parseFloat(prices1[0].price, 'us')
  })

  console.log('checking gdax...')
  gdax.candles(selBase, selCurrency).then(res => {
    $('meta[property=\'vol1d\']').content = `${(res[0].volume / 1000).toFixed(2)} M`
    $('meta[property=\'avg_vol30d\']').content = `${(res.slice(0, 30).reduce((acc, _) => acc + _.volume, 0) / (30 * 1000)).toFixed(2)} M`
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
