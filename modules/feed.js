/* global google */

import moment from 'moment'

google.load('feeds', '1')

const moreNews = document.getElementById('toggleFeed')

const toggleFeed = () => {
  const section = document.getElementById('feed10')
  let word = 'less'

  if (section.style.display === 'none') {
    section.style.display = 'block'
    word = 'less'
  } else {
    section.style.display = 'none'
    word = 'more'
  }

  moreNews.textContent = `Show ${word} watchlist news`
}

moreNews.onclick = () => toggleFeed()

const addResults = (entries, containerId) => {
  const container = document.getElementById(containerId)
  entries.forEach(entry => {
    console.log(entry)

    const a = document.createElement('a')
    const linkText = document.createTextNode(entry.title)
    a.appendChild(linkText)
    a.title = entry.title
    a.href = entry.link
    container.appendChild(a)

    const div = document.createElement('div')
    div.appendChild(document.createTextNode(`Published ${moment(entry.publishedDate).format('ddd MMM DD YYYY')}`))
    container.appendChild(div)
  })
}

const initialize = () => {
  const feed = new google.feeds.Feed('https://www.reddit.com/r/CryptoCurrency.rss')

  feed.load(result => {
    if (!result.error) {
      const top10 = result.feed.entries.slice(2, 12)
      addResults(top10.slice(0, 5), 'feed5')
      addResults(top10.slice(-5), 'feed10')
    }
  })
}

google.setOnLoadCallback(initialize)