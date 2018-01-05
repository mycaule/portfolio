<template>
  <div class="container" id="newsfeed">
    <h4>News</h4>
    <!-- <pre>{{ websites }}</pre> -->
    <select class="form-select select-sm" v-model="feed">
      <option v-for="w in websites" v-bind:value="w.value">
        {{ w.text }}
      </option>
    </select>

    <span>Selected: {{ feed }}</span>

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
        websites,
        feed: 'https://www.reddit.com/r/Bitcoin.rss'
        // entries: res.items
      }
    }
  }
</script>
