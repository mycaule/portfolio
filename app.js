/* global Mavo */
/* eslint import/no-unassigned-import: "off" */

import {parse, format, startOfDay, subDays, differenceInSeconds} from 'date-fns'
import coinbase from './services/coinbase'
import gdax from './services/gdax'
import blockchain from './services/blockchain-info'
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
    openTab(tabItems[i].innerText.trim())
  }
}

const check = () => {
  const selCurrency = $('select[property=\'currency\']').value
  for (let i = 1; i < 5; i++) {
    const selBase = $(`meta[property='base${i}']`).content

    console.log('checking coinbase...')
    coinbase.spot(selCurrency).then(res => {
      const spot = parseFloat(res.find(elt => elt.base === selBase).amount, 'us')
      $(`meta[property='spot${i}']`).content = spot

      coinbase.historic('year', selBase, selCurrency).then(res => {
        const prices52w = res.prices.map(_ => parseFloat(_.price, 'us'))
        $(`meta[property='min52w${i}']`).content = Math.min(...prices52w)
        $(`meta[property='max52w${i}']`).content = Math.max(...prices52w)
      })

      const now = new Date()
      $(`meta[property='checked_time']`).content = format(now, 'H:mm:ss')
      $(`meta[property='checked_time_hourminute']`).content = format(now, 'H:mm')
      $(`meta[property='checked_date']`).content = format(now, 'MM/DD/YYYY')
      $(`meta[property='checked_date_daymonthyear']`).content = format(now, 'YYYY-MM-DD')
    })

    coinbase.historic('week', selBase, selCurrency).then(res => {
      const oneDayAgo = startOfDay(parse(res.prices[0].time))
      const twoDaysAgo = subDays(startOfDay(parse(res.prices[0].time)), 1)

      const prices2d = res.prices.filter(_ => differenceInSeconds(parse(_.time), twoDaysAgo) >= 0).reverse()

      const times = prices2d.map(_ => _.time)
      const prices1 = prices2d.filter(_ => differenceInSeconds(parse(_.time), oneDayAgo) >= 0)
      const prices2 = prices2d.filter(_ => differenceInSeconds(parse(_.time), oneDayAgo) < 0)

      const spot = $(`meta[property=spot${i}]`).content
      charts.draw(times, spot, [prices1, prices2], i)

      $(`meta[property=open1d${i}]`).content = parseFloat(prices1[0].price, 'us')
    })

    console.log('checking gdax...')
    gdax.ticker(selBase, selCurrency).then(res => {
      $(`meta[property='vol1d${i}']`).content = `${(res.volume_24h / 1000).toFixed(2)} M`
      $(`meta[property='avg_vol30d${i}']`).content = `${(res.volume_30d / 30 / 1000).toFixed(2)} M`
    }).catch(() => {
      $(`meta[property='vol1d${i}']`).content = 'N/A'
      $(`meta[property='avg_vol30d${i}']`).content = 'N/A'
    })
  }

  blockchain.users().then(res => {
    const data = res.slice(-3).reverse()
    $(`meta[property='users']`).content = data.length > 0 ? (data[0].count / 10e6).toFixed(2) : 'N/A'
    $(`meta[property='users_gain1d']`).content = data.length > 1 ? ((data[0].count - data[1].count) / 10e3).toFixed(2) : 'N/A'
  })
}

const initDOM = (refCoins, refFeeds) => {
  const removeAll = selectbox => {
    for (let i = selectbox.options.length - 1; i >= 0; i--) {
      selectbox.remove(i)
    }
  }

  const currencies = $('select[property=\'currency\']')
  const feeds = $('select[property=\'feed\']')

  removeAll(currencies)
  removeAll(feeds)

  refCoins.currencies.forEach(elt => {
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

const refCoins = coinbase.reference()
const refFeeds = feed.reference()
initDOM(refCoins, refFeeds)
Mavo.Functions.label = symbol => refCoins.bases.find(_ => _.value === symbol).text
