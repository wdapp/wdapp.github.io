<template>
  <div class="player-wrapper">
    <div class="container">
      <div class="header">
        <player-header></player-header>
      </div>
      <div class="main"
           @mouseenter="onMouseEnter"
           @mouseleave="onMouseLeave"
      >
        <player-control
          :isShowControl="isShowControl"
          :status="status"
          @switch="onSwitch"
          @open="onOpen"
          @bespread="onBespread"
        >
          <player-player
            v-show="isShowPlayer"
            :size="playerSize"
            :isShowClose="isShowControl"
            @close="onClose"
          ></player-player>
          <player-drawpanel
            v-show="isShowDrawPanel"
            :size="drawPanelSize"
            :isShowClose="isShowControl"
            @close="onClose"
          ></player-drawpanel>
        </player-control>
      </div>
      <div class="footer">
        <player-footer></player-footer>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerHeader from './components/PlayerHeader'
import PlayerPlayer from './components/PlayerPlayer'
import PlayerDrawpanel from './components/PlayerDrawpanel'
import PlayerControl from './components/PlayerControl'
import PlayerFooter from './components/PlayerFooter'
import HuodeScene from 'common/websdk/replay'

export default {
  name: 'Player',
  components: {
    PlayerHeader,
    PlayerPlayer,
    PlayerDrawpanel,
    PlayerControl,
    PlayerFooter
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
      HD.showControl(false)
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

  .player-wrapper
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
