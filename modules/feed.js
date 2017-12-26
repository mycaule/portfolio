/* eslint camelcase: "off" */

import axios from 'axios'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import unescapeHtml from 'voca/unescape_html'
import prune from 'voca/prune'

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

  moreNews.textContent = `Show ${word} news`
}

moreNews.onclick = () => toggleFeed()

const addResults = (entries, containerId) => {
  const container = document.getElementById(containerId)
  container.innerHTML = ''

  entries.forEach(entry => {
    const a = document.createElement('a')
    const linkText = document.createTextNode(prune(unescapeHtml(entry.title), 100))
    a.appendChild(linkText)
    a.title = prune(entry.title, 30)
    a.href = entry.link
    container.appendChild(a)

    const div = document.createElement('div')
    div.appendChild(document.createTextNode(`Published ${format(parse(entry.pubDate), 'ddd MMM DD YYYY')}`))
    container.appendChild(div)
  })
}

const rss2json = axios.create({
  baseURL: 'https://api.rss2json.com/v1',
  timeout: 3000
})

// https://www.reddit.com/r/CryptoCurrency.rss
// https://www.reddit.com/r/Bitcoin.rss
const fetch = rss_url =>
  rss2json.get('/api.json', {
    params: {
      rss_url
    }
  }).then(res => {
    const data = res.data
    const top10 = data.items.slice(0, 10)
    addResults(top10.slice(0, 5), 'feed5')
    addResults(top10.slice(-5), 'feed10')
  })

const reference = () => [{text: 'Reddit / CryptoCurrency', value: 'https://www.reddit.com/r/CryptoCurrency.rss'}, {text: 'Reddit / Bitcoin', value: 'https://www.reddit.com/r/Bitcoin.rss'}, {text: 'Coindesk', value: 'https://feeds.feedburner.com/CoinDesk'}]

export default {fetch, reference}
