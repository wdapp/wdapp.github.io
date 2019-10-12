<template>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <live-player-header></live-player-header>
      </div>
      <div class="main">

      </div>
      <div class="footer">

      </div>
    </div>
  </div>
</template>

<script>
import LivePlayerHeader from './components/PlayerHeader'

export default {
  name: 'LivePlayer',
  components: {
    LivePlayerHeader
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .wrapper
    wrapper()
  .container
    width-height-full()
    position relative
    .header
      position absolute
      top 0
      height 70px
      width 100%
    .main
      background-color #9c95ef
      layout-full(70px, 0, 80px, 0)
    .footer
      position absolute
      height 80px
      width 100%
      bottom 0
      background-color #4bb1cf
</style>
