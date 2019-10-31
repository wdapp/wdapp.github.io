<template>
  <div class="player-player-wrapper" :class="size">
    <div v-show="isShowCloseBtn" class="player-close-btn" @click="onClose">
      <span class="player-close-icon"></span>
    </div>
    <hd-interaction v-show="isShowInteraction" class="live-player"></hd-interaction>
    <div class="live-player" id="livePlayer"></div>
  </div>
</template>

<script>
import hdInteraction from 'common/components/interaction/Interaction'

export default {
  name: 'PlayerPlayer',
  components: {
    hdInteraction
  },
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
      status: true,
      isShowInteraction: false
    }
  },
  computed: {
    isShowCloseBtn () {
      return this.size === 'small' && this.isShowClose
    },
    interactionSmall () {
      return 'interaction-' + this.size
    }
  },
  methods: {
    onClose () {
      this.status = false
      this.$emit('close', this.status)
    },
    onEvents () {
      this.bus.$on('interactionStatus', (status) => {
        if (status === 'interacted') {
          this.isShowInteraction = true
        } else {
          this.isShowInteraction = false
        }
      })
    }
  },
  mounted () {
    this.onEvents()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .player-player-wrapper
    background-color $lightBlackColor
    width-height-full()
    .live-player
      position absolute
      width-height-full()
    .player-close-btn
      position absolute
      top 11px
      right 11px
      z-index 1
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
