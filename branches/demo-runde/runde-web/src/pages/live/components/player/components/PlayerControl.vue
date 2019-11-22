<template>
  <div class="player-control-wrapper" ref="playerControlWrapper">
    <common-danmaku class="danmaku-wrap" ref="danmaku"></common-danmaku>
    <div
      class="actions-btn-group"
      v-show="isShowControl"
    >
      <div class="switch-screen-btn" @click="handleSwitchScreenClick" v-show="hideSwitchBtn">
        <span class="icon" :class="switchScreenIcon"></span>
      </div>
      <div
        v-show="isShowInteractionBtn"
        class="interaction-btn"
        @click="handleInteractionClick"
      >
        <span class="icon" :class="interactionIcon"></span>
      </div>
    </div>
    <slot></slot>
    <div
      class="control-wrapper"
      v-show="isShowControl"
    >
      <div class="controls-btn-group">
        <div class="btn-item barrage-btn">
          <el-switch
            class="barrage-switch"
            v-model="isBarrage"
            active-color="#444444"
            inactive-color="#444444"
          >
          </el-switch>
        </div>
        <div class="btn-item setting-btn">
          <span class="btn-icon setting-icon"></span>
        </div>
        <div class="btn-item volume-btn">
          <div class="volume-slider" v-show="isShowVolumeSlider">
            <el-slider
              v-model="volume"
              vertical
              :max="1"
              :min="0"
              :step="0.1"
              height="100px"
              @change="onVolumeChange">
            </el-slider>
          </div>
          <span class="btn-icon volume-icon" @click="handleVolumeClick"></span>
        </div>
        <div class="btn-item full-screen-btn" @click="onFullScreen">
          <span class="btn-icon" :class="fullScreenIcon"></span>
        </div>
      </div>
    </div>
    <div
      class="bespread-wrap"
      :class="{ 'bespread-active': isBespread }"
      @click="handleBespreadClick">
      <i
        class="bespread-icon el-icon-arrow-right"
        :class="{'el-icon-arrow-left': isBespread}"
      >
      </i>
    </div>
  </div>
</template>

<script>
import FullScreen from 'common/fullscreen'
import HuodeScene from 'common/websdk/live'
import CommonDanmaku from 'common/components/danmaku/Danmaku'
import {log} from 'common/utils'

export default {
  name: 'PlayerControl',
  components: {
    CommonDanmaku
  },
  props: {
    isShowControl: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: true
    },
    hideSwitchBtn: {
      type: Boolean,
      default: true
    },
    switchStatus: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isShowInteractionBtn: false,
      interactionStatus: 'interaction',
      toggleSwitchScreenBtnStatus: true,
      toggleFullScreenBtn: true,
      isBespread: false,
      volume: 1,
      isShowVolumeSlider: false,
      isBarrage: false
    }
  },
  computed: {
    switchScreenIcon () {
      return (this.toggleSwitchScreenBtnStatus ? 'switch' : 'open') + '-screen-icon'
    },
    interactionIcon () {
      if (this.interactionStatus === 'interacting') {
        return 'hangup-icon'
      } else if (this.interactionStatus === 'interacted') {
        return 'interaction-on-icon'
      } else {
        return 'interaction-icon'
      }
    },
    fullScreenIcon () {
      return (this.toggleFullScreenBtn ? 'full' : 'small') + '-screen-icon'
    },
    danmaku () {
      return this.$refs.danmaku
    }
  },
  watch: {
    status () {
      this.toggleSwitchScreenBtnStatus = this.status
    },
    interactionStatus () {
      log('interactionStatus', this.interactionStatus)
      this.bus.$emit('interactionStatus', this.interactionStatus)
    }
  },
  methods: {
    handleSwitchScreenClick () {
      if (this.toggleSwitchScreenBtnStatus) {
        let status = !this.switchStatus
        this.$emit('switch', status)
      } else {
        const status = true
        this.$emit('open', status)
      }
    },
    handleBespreadClick () {
      this.isBespread = !this.isBespread
      this.$emit('bespread', this.isBespread)
    },
    onFullScreen () {
      this.fullscreen.webFullScreen()
    },
    onVolumeChange (val) {
      this.HD.setSound(val)
      log('onVolumeChange', val)
    },
    handleVolumeClick () {
      this.isShowVolumeSlider = !this.isShowVolumeSlider
    },
    init () {
      this.HD = new HuodeScene()
      this.addEvents()

      const target = this.$refs.playerControlWrapper
      this.fullscreen = new FullScreen(target, () => {
        this.toggleFullScreenBtn = false
      }, () => {
        this.toggleFullScreenBtn = true
      })
    },
    addEvents () {
      this.HD.onRoomSetting((options) => {
        log('onRoomSetting', options)
        if (options.allow_speak_interaction === 'true') {
          this.isShowInteractionBtn = true
        } else {
          this.isShowInteractionBtn = false
        }
      })
      this.HD.onInteractionRemoteMedia(() => {
        this.interactionStatus = 'interacted'
        log('onInteractionRemoteMedia')
      })
      this.HD.onInteractionDisconnect(() => {
        this.interactionStatus = 'interaction'
        log('onInteractionDisconnect')
      })
      this.HD.onInteractionRequestTimeout(() => {
        this.interactionStatus = 'interaction'
        log('onInteractionRequestTimeout')
      })
      this.HD.onInteractionCancal(() => {
        this.interactionStatus = 'interaction'
        log('onInteractionCancal')
      })
      this.bus.$on('danmaku', msg => {
        this.sendDanmaku(msg)
      })
    },
    sendDanmaku (msg) {
      if (this.isBarrage) {
        this.danmaku.sendDanmaku({
          msg: msg
        })
      }
    },
    handleInteractionClick () {
      if (this.interactionStatus === 'interaction') {
        this.HD.requestInteraction()
        this.interactionStatus = 'interacting'
      } else {
        this.HD.hangupInteraction()
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .player-control-wrapper
    position absolute
    top 0
    width-height-full()
    .danmaku-wrap
      position absolute
      top 0
      z-index 1
    .actions-btn-group
      position absolute
      top 228px
      right 22px
      z-index 1
      .switch-screen-btn
        margin-bottom 31px
        .icon
          background url("~images/switch-screen.png") no-repeat
          display inline-block
          background-size 70px
          width-height-same(70px)
        .switch-screen-icon
          background-image url("~images/switch-screen.png")
        .open-screen-icon
          background-image url("~images/open-screen.png")
      .interaction-btn
        .icon
          background url("~images/put-up-hands.png") no-repeat
          display inline-block
          background-size 70px
          width-height-same(70px)
        .interaction-icon
          background-image url("~images/put-up-hands.png")
        .interaction-on-icon
          background-image url("~images/put-up-hands-on.png")
        .hangup-icon
          background-image url("~images/hangup.png")
    .control-wrapper
      width 100%
      height 58px
      background rgba(0, 0, 0, 0.7)
      position absolute
      bottom 0
      box-sizing border-box
      z-index 1
      .controls-btn-group
        position absolute
        top 50%
        margin-top -15px
        right 17px
        .btn-item
          float left
          margin-left 32px
          cursor-pointer()
          .btn-icon
            display inline-block
            width-height-same(30px)
            background-size 30px
            background-repeat no-repeat
          .setting-icon
            background-image url("~images/setting.png")
          .volume-icon
            background-image url("~images/volume.png")
          .full-screen-icon
            background-image url("~images/full-screen.png")
          .small-screen-icon
            background-image url("~images/small-screen.png")
        .volume-btn
          .volume-slider
            position absolute
            bottom 60px
            padding 11px 0px 12px 0px; /*no*/
            box-sizing border-box
            width 37px
            border-radius 4px; /*no*/
            background-color rgba(0, 0, 0, 0.7)
            >>> .el-slider
              .el-slider__runway
                .el-slider__bar
                  background-color $baseRedColor
                  border-radius 3px
                .el-slider__button-wrapper
                  .el-slider__button
                    border none
        .setting-btn
          display none
        .barrage-btn
          width 75px
          height 30px
          .barrage-switch
            width-height-full()
            >>> .el-switch__core
              width 75px !important
              height 30px !important
              border-radius 15px
            >>> .el-switch__core:after
              width-height-same(20px)
              margin-top 3px
              margin-left 3px
          .is-checked
            >>> .el-switch__core:after
              background-color $baseRedColor
              left 64%
          .barrage-switch:after
            content '弹幕'
            position absolute
            left 32px
            top 5px
            baseTextStyle(16px, $baseWhiteColor)
          .is-checked:after
            content '弹幕'
            position absolute
            left 10px
            top 5px
            baseTextStyle(16px, $baseWhiteColor)
    .bespread-wrap
      position absolute
      z-index 1
      right -35px
      top 50%
      margin-top -50px
      width 15px
      height 100px
      background $dullGreyColor
      border-radius 0px 10px 10px 0px; /*no*/
      text-align center
      line-height 100px
      .bespread-icon
        font-size 16px
        color $baseWhiteColor
        font-weight $baseFontWeight
    .bespread-active
      border-radius 10px 0px 0px 10px; /*no*/
      background rgba(221, 221, 221, 0.5)
      right 0
</style>
