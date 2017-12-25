import parser from 'rss-parser'

import moment from 'moment'
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

  moreNews.textContent = `Show ${word} watchlist news`
}

moreNews.onclick = () => toggleFeed()

const addResults = (entries, containerId) => {
  const container = document.getElementById(containerId)
  entries.forEach(entry => {
    const a = document.createElement('a')
    const linkText = document.createTextNode(prune(unescapeHtml(entry.title), 100))
    a.appendChild(linkText)
    a.title = prune(entry.title, 30)
    a.href = entry.link
    container.appendChild(a)

    const div = document.createElement('div')
    div.appendChild(document.createTextNode(`Published ${moment(entry.isoDate).format('ddd MMM DD YYYY')}`))
    container.appendChild(div)
  })
}

parser.parseURL('https://www.reddit.com/r/Bitcoin.rss', (err, parsed) => {
  if (err) {
    console.log(err)
  } else {
    const top10 = parsed.feed.entries.slice(2, 12)
    addResults(top10.slice(0, 5), 'feed5')
    addResults(top10.slice(-5), 'feed10')
  }
})
