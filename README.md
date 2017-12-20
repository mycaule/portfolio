<p align="center">
  Bitcoin Watchlist
</p>

<p align="center">
  <a href="http://travis-ci.org/mycaule/portfolio"><img src="https://api.travis-ci.org/mycaule/portfolio.svg?branch=master" alt="Build Status"></a>
  <a href="https://david-dm.org/mycaule/portfolio"><img src="https://david-dm.org/mycaule/portfolio/status.svg" alt="dependencies Status"></a>
  <a href="https://david-dm.org/mycaule/portfolio?type=dev"><img src="https://david-dm.org/mycaule/portfolio/dev-status.svg" alt="devDependencies Status"></a>
  <br>
  <br>
</p>

A simple webapp to check the values of cryptocurrencies value compared to other time-series metrics.

The project uses [Coinbase API](https://coinbase.com).

[Open an issue](https://github.com/mycaule/portfolio/issues) if the data is incorrect or if you want some metric to appear on the list. You can also check [the roadmap for this application](#user-content-roadmap).

I hope you have lots of fun using it!

## Contributions

Changes and improvements are welcome! Feel free to fork and open a pull request into `master`.

#### Linting and Testing
```
npm install
npm test
```

#### Development
```
npm start
```

Runs a local webserver at [http:localhost:1234](http:localhost:1234) with parcel bundler.

#### Production
```
parcel build app.js
git push
```

Regenerate the build and deploy to GitHub pages on master /docs folder.

### Roadmap

- [ ] Migrate to [UIkit](https://getuikit.com)
- [ ] UI: Threshold detection (periodic unit tests with TravisCI and ava snapshots)
- [ ] Data quality: Add more metrics
- [ ] Errors with `superstruct` [returning-errors](https://github.com/ianstormtaylor/superstruct/blob/master/examples/returning-errors.js), [throwing-errors](https://github.com/ianstormtaylor/superstruct/blob/master/examples/throwing-errors.js), [custom-errors](https://github.com/ianstormtaylor/superstruct/blob/master/examples/custom-errors.js)

### License

`portfolio` is licensed under the [MIT License](https://github.com/mycaule/portfolio/blob/master/LICENSE).

## References

* [Coinbase API Reference](https://developers.coinbase.com/api/v2#data-endpoints)
* [GDAX API](https://docs.gdax.com/#market-data)
* [Mavo](https://mavo.io/)
* [Baidu Echarts](https://github.com/ecomfe/echarts)
* [Bloomberg Watchlist](https://www.bloomberg.com/markets/watchlist)
* [rss2json](https://rss2json.com/google-feed-api-alternative)
* [CryptoCurrencies News Sites](https://www.reddit.com/r/CryptoCurrency/comments/6y8tbx/rss_feeds_cryptocurrencies_news_sites/)
