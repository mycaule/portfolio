/* eslint-disable no-new */

import Vue from 'vue/dist/vue'
import Watchlist from './watchlist.vue'
import Newsfeed from './newsfeed.vue'
import Benchmark from './benchmark.vue'

new Vue({
  el: '#watchlist',
  name: Watchlist,
  components: {Watchlist},
  template: `<Watchlist />`
})

new Vue({
  el: '#newsfeed',
  name: Newsfeed,
  components: {Newsfeed},
  template: `<Newsfeed />`
})

new Vue({
  el: '#benchmark',
  name: Benchmark,
  components: {Benchmark},
  template: `<Benchmark />`
})

if (module.hot) {
  module.hot.accept()
}
