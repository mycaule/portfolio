/* eslint import/no-unassigned-import: "off" */

import {parse, format, startOfDay, subDays, differenceInSeconds} from 'date-fns'
import coinbase from './services/coinbase'
import gdax from './services/gdax'
import charts from './modules/charts'
import feed from './modules/feed'
import changes from './modules/changes'

feed.fetch('https://www.reddit.com/r/Bitcoin.rss')

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

    const now = new Date()
    $('meta[property=\'checked_time\']').content = format(now, 'H:mm:ss')
    $('meta[property=\'checked_date\']').content = format(now, 'MM/DD/YYYY')
    $('meta[property=\'checked_date_format\']').content = format(now, 'YYYY-MM-DD')
  })

  coinbase.historic('week', selBase, selCurrency).then(res => {
    const oneDayAgo = startOfDay(parse(res.prices[0].time))
    const twoDaysAgo = subDays(startOfDay(parse(res.prices[0].time)), 1)

    const prices2d = res.prices.filter(_ => differenceInSeconds(parse(_.time), twoDaysAgo) >= 0).reverse()

    const times = prices2d.map(_ => _.time)
    const prices1 = prices2d.filter(_ => differenceInSeconds(parse(_.time), oneDayAgo) >= 0)
    const prices2 = prices2d.filter(_ => differenceInSeconds(parse(_.time), oneDayAgo) < 0)

    const spot = $('meta[property=\'spot\']').content
    charts.draw(times, spot, prices1, prices2)

    $('meta[property=\'open1d\']').content = parseFloat(prices1[0].price, 'us')
  })

  console.log('checking gdax...')
  gdax.ticker(selBase, selCurrency).then(res => {
    $('meta[property=\'vol1d\']').content = `${(res.volume_24h / 1000).toFixed(2)} M`
    $('meta[property=\'avg_vol30d\']').content = `${(res.volume_30d / 30 / 1000).toFixed(2)} M`
  }).catch(() => {
    $('meta[property=\'vol1d\']').content = 'N/A'
    $('meta[property=\'avg_vol30d\']').content = 'N/A'
  })
}

const initDOM = () => {
  const ref = coinbase.reference()
  const refFeeds = feed.reference()

  const removeAll = selectbox => {
    for (let i = selectbox.options.length - 1; i >= 0; i--) {
      selectbox.remove(i)
    }
  }

  const currencies = $('select[property=\'currency\']')
  const bases = $('select[property=\'base\']')
  const feeds = $('select[property=\'feed\']')

  removeAll(currencies)
  removeAll(bases)
  removeAll(feeds)

  ref.bases.forEach(elt => {
    const opt = document.createElement('option')
    opt.text = elt.text
    opt.value = elt.value
    bases.add(opt)
  })

  ref.currencies.forEach(elt => {
    const opt = document.createElement('option')
    opt.text = elt.text
    opt.value = elt.value
    currencies.add(opt)
  })

  refFeeds.forEach(elt => {
    const opt = document.createElement('option')
    opt.text = elt.text
    opt.value = elt.value
    feeds.add(opt)
  })

  changes.listen({
    base: check,
    currency: check,
    feed: feed.fetch
  })
  check()
}

initDOM()
