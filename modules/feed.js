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
    div.appendChild(document.createTextNode(`Published ${moment(entry.pubDate).format('ddd MMM DD YYYY')}`))
    container.appendChild(div)
  })
}

const xhr = new XMLHttpRequest()

xhr.onreadystatechange = () => {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const data = JSON.parse(xhr.responseText)
    if (data.status === 'ok') {
      const top10 = data.items.slice(2, 12)
      addResults(top10.slice(0, 5), 'feed5')
      addResults(top10.slice(-5), 'feed10')
    }
  }
}

// https://www.reddit.com/r/CryptoCurrency.rss
xhr.open('GET', `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://www.reddit.com/r/Bitcoin.rss')}`, true)
xhr.send()
