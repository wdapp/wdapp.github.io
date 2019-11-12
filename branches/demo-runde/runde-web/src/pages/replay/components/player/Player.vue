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
          :switchStatus="switchStatus"
          :isShowControl="isShowControl"
          :status="status"
          :hideSwitchBtn="hideSwitchBtn"
          @switch="onSwitch"
          @open="onOpen"
          @bespread="onBespread"
        >
          <player-player
            slot="controls"
            v-show="isShowPlayer"
            :size="playerSize"
            :isShowClose="isShowControl"
            @close="onClose"
          ></player-player>
          <player-drawpanel
            slot="controls"
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
import { mapState } from 'vuex'

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
      switchStatus: false,
      status: true,
      isExsitPanel: true, // 单视频无文档模板需要隐藏文档和切换按钮
      hideSwitchBtn: true // 是否有文档
    }
  },
  computed: {
    ...mapState(['template']),
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
  watch: {
    template (tem) {
      /*
      * 模板 1 ：视频
      * 模板 2 ：视频、聊天、问答
      * 模板 3 ：视频、聊天
      * 模板 4 ：视频、文档、聊天
      * 模板 5 ：视频、文档、聊天、问答
      * 模板 6 ：视频、问答
      * */

      if (tem.type !== 4 && tem.type !== 5) {
        this.hideSwitchBtn = false // 隐藏切换按钮
        this.isExsitPanel = false// 是否为文档模式
        this.switchStatus = true // 切换视频为主
        this.status = false // 关闭小窗
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
