<template>
  <div class="container" id="watchlist">
    <h4>Watchlist</h4>
    <!-- <pre>{{ coinbase }}</pre> -->

    <select class="form-select select-sm" v-model="base">
      <option v-for="b in coinbase.bases" v-bind:value="b.value">
        {{ b.text }}
      </option>
    </select>

    <span>Selected: {{ base }}</span>

    <select class="form-select select-sm" v-model="currency">
      <option v-for="c in coinbase.currencies" v-bind:value="c.value">
        {{ c.text }}
      </option>
    </select>

    <span>Selected: {{ currency }}</span>
  </div>
</template>

<script>
  import coinbase from '../services/coinbase'

  const component = {
    data: () => {
      return {
        coinbase: coinbase.reference(),
        base: 'BTC',
        currency: 'EUR'
      }
    },
    watch: {
      base: (val, oldVal) => {
        console.log(`${oldVal} -> ${val}`)
      }
    }
  }

  export default component
</script>
