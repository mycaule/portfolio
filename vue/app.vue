<template>
  <div id="vue">
    <h1>Hello, {{ framework }}!</h1>
    <pre>
    {{ coinbase }}
    </pre>
  </div>
</template>

<script>
  import coinbase from '../services/coinbase'
  export default {
    data: () => {
      return {
        coinbase: coinbase.reference(),
        framework: "Vue"
      }
    }
  }
</script>

<style lang="scss" scoped>
  h1 {
    color: #05ede1;
  }
</style>
