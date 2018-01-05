<template>
  <div class="container" id="benchmark">
    <h4>Benchmark</h4>
    <table class="table table-scroll">
      <tr>
        <td>Blockchain Wallets</td>
        <td>{{ users }}</td>
        <td class="text-success">{{ users_gain1d }}</td>
        <td class="text-success"><i class="icon icon-upward"></i>{{ users_variation }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  const component = {
    data: () => {
      return {
        users: '1.56 G',
        users_gain1d: '+3.45 M',
        users_variation: '0.25 %'
      }
    }
  }

  export default component
</script>
