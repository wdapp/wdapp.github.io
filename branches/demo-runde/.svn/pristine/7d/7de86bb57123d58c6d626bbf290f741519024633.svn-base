<template>
  <div class="transfer-wrapper"></div>
</template>

<script>
import {log} from 'common/utils'

export default {
  name: 'Transfer',
  methods: {},
  mounted () {
    log('transfer live', this.$route)
    const name = this.$route.params.name
    const options = this.$route.params.options
    this.$router.push({
      name: name,
      params: {
        options: options
      }
    })
  }
}
</script>
