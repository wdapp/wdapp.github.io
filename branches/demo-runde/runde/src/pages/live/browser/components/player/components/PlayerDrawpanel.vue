<template>
  <div class="player-drawpanel-wrapper" :class="size" v-show="!closeStatus">
    <div v-show="isShowCloseBtn" class="drawpanel-close-btn" @click="onClose">
      <span class="drawpanel-close-icon"></span>
    </div>
    <div class="drawpanel">
      <div id="drawPanel"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerDrawpanel',
  props: {
    isShowClose: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  computed: {
    isShowCloseBtn () {
      return this.size === 'small' && this.isShowClose
    }
  },
  data () {
    return {
      closeStatus: false
    }
  },
  methods: {
    onClose () {
      this.closeStatus = true
      this.$emit('close', this.closeStatus)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .player-drawpanel-wrapper
    background-color $baseWhiteColor
    width-height-full()
    .drawpanel
      width-height-full()
    .drawpanel-close-btn
      position absolute
      top 11px
      right 11px
      .drawpanel-close-icon
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
