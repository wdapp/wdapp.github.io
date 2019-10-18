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
          :closeStatus="closeStatus"
          @switch="onSwitch"
        >
          <live-player-player
            :size="playerSize"
            :isShowClose="isShowControl"
            @close="onClose"
          ></live-player-player>
          <live-player-drawpanel
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
      status: true,
      closeStatus: false
    }
  },
  computed: {
    playerSize () {
      return this.status ? 'large' : 'small'
    },
    drawPanelSize () {
      return !this.status ? 'large' : 'small'
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
      this.status = status
    },
    onClose (closeStatus) {
      this.closeStatus = closeStatus
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
