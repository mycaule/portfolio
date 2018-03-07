import {parse, format} from 'date-fns'
import unescapeHtml from 'voca/unescape_html'
import prune from 'voca/prune'
import rss2json from '../services/rss2json'

const moreNews = document.getElementById('toggleFeed')

const websites = [
  {
    text: '/r/CryptoCurrency',
    value: 'https://www.reddit.com/r/CryptoCurrency.rss',
    original: 'https://www.reddit.com/r/CryptoCurrency'
  }, {
    text: '/r/Bitcoin',
    value: 'https://www.reddit.com/r/Bitcoin.rss',
    original: 'https://www.reddit.com/r/Bitcoin'
  }, {
    text: '/r/Ethereum',
    value: 'https://www.reddit.com/r/Ethereum.rss',
    original: 'https://www.reddit.com/r/Ethereum'
  }, {
    text: '/r/IcoCrypto',
    value: 'https://www.reddit.com/r/icocrypto.rss',
    original: 'https://www.reddit.com/r/icocrypto'
  }, {
    text: 'Coindesk',
    value: 'https://feeds.feedburner.com/CoinDesk',
    original: 'https://www.coindesk.com'
  }, {
    text: 'Digital Money',
    value: 'https://www.forbes.com/digital-money/feed2',
    original: 'https://www.forbes.com/digital-mone'
  }, {
    text: 'BitcoinCore',
    value: 'https://bitcoincore.org/en/rss.xml',
    original: 'https://bitcoincore.org/'
  }, {
    text: 'Ethereum.org',
    value: 'https://blog.ethereum.org/feed',
    original: 'https://blog.ethereum.org'
  }]

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
    div.appendChild(document.createTextNode(entry.pubDate ? `Published ${format(parse(entry.pubDate), 'ddd MMM DD YYYY')}` : ''))
    container.appendChild(div)
  })
}

const fetch = url =>
  rss2json.convert(url)
    .then(_ => {
      const top10 = _.items ? _.items.slice(0, 10) : [{title: 'No news available', pubDate: '', link: url}]
      addResults(top10.slice(0, 5), 'feed5')
      addResults(top10.slice(5, 10), 'feed10')
    }).catch(() => {
      const elt = websites.find(_ => _.value === url)
      addResults([{
        title: `${elt.text}: RSS unavailable`,
        pubDate: '',
        link: elt.original
      }], 'feed5')
      addResults([], 'feed10')
    })

const reference = () => websites

export default {fetch, reference}
