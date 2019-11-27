<template>
  <div class="wrapper">
    <div class="top">

    </div>
    <div class="bottom">

    </div>
  </div>
</template>

<script>
import Flexible from 'common/flexible'

export default {
  name: 'Live',
  methods: {
    init () {
      this.flexible()
    },
    flexible () {
      const flexible = new Flexible({
        maxWidth: 1920,
        minWidth: 320
      })
      flexible.refreshRem()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl";

  .wrapper
    wrapper()
    .top
      width 100%
      height 231px
      background-color pink
    .bottom
      layout-full(231px, 0, 0, 0)
      background-color green
</style>
