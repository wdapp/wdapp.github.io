<template>
  <div class="live-player-wrapper">
    <div class="container">
      <div class="header">
        <live-player-header></live-player-header>
      </div>
      <div class="main"
           @mouseenter="onMouseEnter"
           @mouseleave="onMouseLeave"
      >
        <Live-player-control
          :isShowControl="isShowControl"
          :status="status"
          @switch="onSwitch"
          @open="onOpen"
          @bespread="onBespread"
        >
          <live-player-player
            v-show="isShowPlayer"
            :size="playerSize"
            :isShowClose="isShowControl"
            @close="onClose"
          ></live-player-player>
          <live-player-drawpanel
            v-show="isShowDrawPanel"
            :size="drawPanelSize"
            :isShowClose="isShowControl"
            @close="onClose"
          ></live-player-drawpanel>
        </Live-player-control>
      </div>
      <div class="footer">
        <live-player-footer></live-player-footer>
      </div>
    </div>
  </div>
</template>

<script>
import LivePlayerHeader from './components/PlayerHeader'
import LivePlayerPlayer from './components/PlayerPlayer'
import LivePlayerDrawpanel from './components/PlayerDrawpanel'
import LivePlayerControl from './components/PlayerControl'
import LivePlayerFooter from './components/PlayerFooter'
import HuodeScene from 'common/websdk/live'
import FlashTip from 'common/flashtip'

export default {
  name: 'LivePlayer',
  components: {
    LivePlayerHeader,
    LivePlayerPlayer,
    LivePlayerDrawpanel,
    LivePlayerControl,
    LivePlayerFooter
  },
  data () {
    return {
      isShowControl: false,
      switchStatus: true,
      status: true
    }
  },
  computed: {
    playerSize () {
      return this.switchStatus ? 'large' : 'small'
    },
    drawPanelSize () {
      return !this.switchStatus ? 'large' : 'small'
    },
    isShowPlayer () {
      if (this.playerSize === 'small') {
        return this.status
      } else {
        return true
      }
    },
    isShowDrawPanel () {
      if (this.drawPanelSize === 'small') {
        return this.status
      } else {
        return true
      }
    }
  },
  methods: {
    init () {
      const HD = new HuodeScene()

      FlashTip.init()

      HD.onPlayerLoad(() => {
        HD.showControl(false)
        HD.docAdapt(true)
      })
    },
    onMouseEnter () {
      this.isShowControl = true
    },
    onMouseLeave () {
      this.isShowControl = false
    },
    onSwitch (status) {
      this.switchStatus = status
    },
    onClose (status) {
      this.status = status
    },
    onOpen (status) {
      this.status = status
    },
    onBespread (status) {
      this.$emit('bespread', status)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .live-player-wrapper
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
      layout-full(70px, 0, 80px, 0)
    .footer
      position absolute
      height 80px
      width 100%
      bottom 0
</style>
