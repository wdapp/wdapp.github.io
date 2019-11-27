<template>
  <div class="player-player-wrapper" :class="size">
    <div v-show="isShowCloseBtn" class="player-close-btn" @click="onClose">
      <span class="player-close-icon"></span>
    </div>
    <div class="live-player" id="livePlayer"></div>
  </div>
</template>

<script>
export default {
  name: 'PlayerPlayer',
  props: {
    isShowClose: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'large'
    }
  },
  data () {
    return {
      status: true
    }
  },
  computed: {
    isShowCloseBtn () {
      return this.size === 'small' && this.isShowClose
    }
  },
  methods: {
    onClose () {
      this.status = false
      this.$emit('close', this.status)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .player-player-wrapper
    background-color $lightBlackColor
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
  .small
    position absolute
    width 290px
    height 163px
    bottom 0
  .large
    width-height-full()
</style>
