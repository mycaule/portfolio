<template>
  <div id="newsfeed">
    <pre>{{ websites }}</pre>

    <pre>{{ entries }}</pre>
  </div>
</template>

<script>
  // import rss2json from '../services/rss2json'

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
      text: '/r/Litecoin',
      value: 'https://www.reddit.com/r/Litecoin.rss',
      original: 'https://www.reddit.com/r/Litecoin'
    }, {
      text: '/r/Ethereum',
      value: 'https://www.reddit.com/r/Ethereum.rss',
      original: 'https://www.reddit.com/r/Ethereum'
    }, {
      text: '/r/BCash',
      value: 'https://www.reddit.com/r/BCash.rss',
      original: 'https://www.reddit.com/r/BCash'
    }, {
      text: 'Coindesk',
      value: 'https://feeds.feedburner.com/CoinDesk',
      original: 'https://www.coindesk.com'
    }, {
      text: 'BitcoinCore',
      value: 'https://bitcoincore.org/en/rss.xml',
      original: 'https://bitcoincore.org/'
    }]

  // console.log(rss2json.convert(websites[0].value).then(_ => _.items))

  export default {
    data: () => {
      // const res = rss2json.convert(websites[0].value)

      return {
        websites
        // entries: res.items
      }
    }
  }
</script>

<style lang="scss" scoped>
  h1 {
    color: #05ede1;
  }
</style>
