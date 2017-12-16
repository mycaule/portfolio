const coinbase = require('./services/coinbase')

const $ = s => document.querySelector(s)

const initHTMLFields = (base, currency, basesRef, currenciesRef) => {
  const currencies = $('select[property=\'currency\']')
  const bases = $('select[property=\'base\']')

  basesRef.forEach(elt => {
    const opt1 = document.createElement('option')
    opt1.text = elt
    opt1.value = elt
    bases.add(opt1)
  })

  currenciesRef.forEach(elt => {
    const opt2 = document.createElement('option')
    opt2.text = elt
    opt2.value = elt
    currencies.add(opt2)
  })

  currencies.value = currency
  bases.value = base
}

coinbase.spot().then(res => console.log(res))

coinbase.historic().then(res => console.log(res))

initHTMLFields('BTC', 'EUR', ['BTC', 'ETH', 'LTC'], ['EUR', 'USD'])
