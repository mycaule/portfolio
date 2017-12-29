/* eslint-disable no-new */

import Vue from 'vue/dist/vue'
import App from './app.vue'
// Import Newsfeed from './newsfeed.vue'

const app = window.addEventListener('load', () => {
  // New Vue({
  //   el: '#newsfeed',
  //   name: Newsfeed,
  //   components: {Newsfeed},
  //   template: `<Newsfeed />`
  // })

  new Vue({
    el: '#vueapp',
    name: App,
    components: {App},
    template: `<App />`
  })
})

if (module.hot) {
  module.hot.accept()
}

export default app
