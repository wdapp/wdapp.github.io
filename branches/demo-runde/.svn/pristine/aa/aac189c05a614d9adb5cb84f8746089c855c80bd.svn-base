<template>
  <div class="player-player-wrapper">
    <div v-show="isShowCloseBtn" class="player-close-btn">
      <span class="player-close-icon"></span>
    </div>
    <div class="live-player" id="livePlayer"></div>
  </div>
</template>

<script>
export default {
  name: 'PlayerPlayer',
  data () {
    return {
      isShowCloseBtn: false
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .player-player-wrapper
    width-height-full()
    .live-player
      width-height-full()
    .player-close-btn
      position absolute
      top 11px
      right 11px
      .player-close-icon
        display inline-block
        background url("~images/close.png") no-repeat
        background-size 30px
        width-height-same(30px)
</style>
