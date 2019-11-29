<template>
  <div class="player-control-wrapper" ref="playerControlWrapper">
    <div
      class="actions-btn-group"
      v-show="isShowControl"
    >
      <div
        class="switch-screen-btn"
        @click="handleSwitchScreenClick"
        v-show="hideSwitchBtn"
      >
        <span
          class="icon"
          :class="switchScreenIcon"
        ></span>
      </div>
      <div
        class="play-wrap"
        @click="handlePlayClick"
      >
        <hd-play
          class="play-btn"
          :status="playerStatus"
        ></hd-play>
      </div>
    </div>
    <slot name="controls"></slot>
    <div
      class="control-wrap"
      v-show="isShowControl"
    >
      <hd-slider
        class="slider-wrap"
        :duration="duration"
        :currentTime="currentTime"
        @seek="onSeek"
        @move="onMove"
      ></hd-slider>
      <div class="controls-btn-group">
        <div class="btn-item play-btn" @click="handlePlayClick">
          <span
            class="btn-icon play-icon"
            :class="{'pause': playerStatus}"
          ></span>
        </div>
        <div class="btn-item full-screen-btn" @click="onFullScreen">
          <span class="btn-icon" :class="fullScreenIcon"></span>
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
        <div class="btn-item setting-btn">
          <span class="btn-icon setting-icon"></span>
        </div>
        <div class="btn-item definition-btn">
          <span class="btn-text definition-text">高清</span>
        </div>
        <div class="btn-item rate-btn" @click="toggleRate">
          <ul class="rate-list" v-show="isShowRate">
            <li class="rate-item"
                :class="{'rate-active': playerRateIndex(index)}"
                v-for="(rate, index) of formatRateLists"
                :key="index"
                @click="handleRateClick(index)"
            >
              {{rate + 'x'}}
            </li>
          </ul>
          <span
            class="btn-text rate-text"
            :class="{'rate-btn-active': isShowRate}"
          >
          {{rate + 'x'}}
          </span>
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
import HuodeScene from 'common/websdk/replay'
import hdPlay from 'common/components/play/Play'
import hdSlider from 'common/components/slider/Slider'
import {log} from 'common/utils'
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'PlayerControl',
  components: {
    hdPlay,
    hdSlider
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
      toggleSwitchScreenBtnStatus: true,
      toggleFullScreenBtn: true,
      isBespread: false,
      volume: 1,
      isShowVolumeSlider: false,
      isBarrage: false,
      rateLists: ['0.5', '1', '1.2', '1.5', '2'],
      rateIndex: 1,
      isShowRate: false,
      rate: 1,
      duration: 0,
      currentTime: 0,
      timer: 0,
      interval: 500
    }
  },
  computed: {
    ...mapState(['playerStatus']),
    formatRateLists () {
      const lists = [...this.rateLists]
      return lists.reverse()
    },
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
    }
  },
  watch: {
    playerStatus () {
      log('playerStatus', this.playerStatus)
    },
    status () {
      this.toggleSwitchScreenBtnStatus = this.status
    },
    interactionStatus () {
      log('interactionStatus', this.interactionStatus)
      this.bus.$emit('interactionStatus', this.interactionStatus)
    }
  },
  methods: {
    ...mapMutations(['changePlayerStatus']),
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
      log('onVolumeChange', this.HD.getSound())
    },
    handleVolumeClick () {
      this.isShowVolumeSlider = !this.isShowVolumeSlider
    },
    init () {
      this.HD = new HuodeScene()
      this.addEvents(this.HD)

      const target = this.$refs.playerControlWrapper
      this.fullscreen = new FullScreen(target, () => {
        this.toggleFullScreenBtn = false
      }, () => {
        this.toggleFullScreenBtn = true
      })
    },
    handleRateClick (index) {
      const _index = (this.rateLists.length - 1) - index
      this.rate = this.rateLists[_index]
      this.HD.setRate(this.rate)
      this.rateIndex = _index
      log('setRate', this.rate)
    },
    playerRateIndex (index) {
      const _index = (this.rateLists.length - 1) - index
      return this.rateIndex === _index
    },
    toggleRate () {
      this.isShowRate = !this.isShowRate
    },
    addEvents (HD) {
      let status = this.playerStatus
      HD.onPlayerLoad(() => {
        this.duration = HD.getDuration()
        this.$emit('docAdapt')
        log('duration', this.duration)
        log('onPlayerLoad')
      })
      this.$once('docAdapt', () => {
        HD.docAdapt(true)
        log('docAdapt')
      })
      HD.onPlaying(() => {
        status = true
        this.changePlayerStatus(status)
        this.startTimer()
        log('onPlaying')
      })
      HD.onPause(() => {
        status = false
        this.changePlayerStatus(status)
        this.stopTimer()
        log('onPause')
      })
      HD.onEnded(() => {
        status = false
        this.changePlayerStatus(status)
        this.stopTimer()
        log('onEnded')
      })
    },
    handlePlayClick () {
      this.HD.togglePlay()
    },
    onSeek (value) {
      this.HD.seek(value)
      log('onSeek', value)
    },
    onMove () {
      this.stopTimer()
    },
    startTimer () {
      if (this.timer) {
        return false
      }
      this.timer && this.stopTimer()
      this.timer = setInterval(() => {
        this.timeupdate()
      }, this.interval)
      log('startTimer')
    },
    stopTimer () {
      if (!this.timer) {
        return false
      }
      clearTimeout(this.timer)
      this.timer = 0
      log('stopTimer')
    },
    timeupdate () {
      this.currentTime = this.HD.getCurrentTime()
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    this.stopTimer()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .player-control-wrapper
    position absolute
    top 0
    width-height-full()
    .actions-btn-group
      layout-full(0, 0, 58px, 0)
      .switch-screen-btn
        position absolute
        top 228px
        right 22px
        z-index 1
        .icon
          background url("~images/switch-screen.png") no-repeat
          display inline-block
          background-size 70px
          width-height-same(70px)
        .switch-screen-icon
          background-image url("~images/switch-screen.png")
        .open-screen-icon
          background-image url("~images/open-screen.png")
      .play-wrap
        position absolute
        left 50%
        top 50%
        width-height-same(90px)
        margin-left -45px
        margin-top -45px
        z-index 1
    .control-wrap
      width 100%
      height 58px
      background rgba(0, 0, 0, 0.7)
      position absolute
      bottom 0
      z-index 1
      .slider-wrap
        position absolute
        top -4px
        height 4px
        z-index 1
      .controls-btn-group
        position absolute
        top 50%
        margin-top -15px
        left 37px
        right 17px
        height 30px
        .btn-item
          float right
          margin-left 32px
          cursor-pointer()
          .btn-icon
            display inline-block
            width-height-same(30px)
            background-size 30px
            background-repeat no-repeat
          .btn-text
            display inline-block
            baseTextStyle(14px, $baseWhiteColor, 400, $genelFontFamily)
            width 59px
            height 25px
            background rgba(255, 255, 255, 0.2)
            border-radius 13px
            text-align center
            line-height 25px
            margin-top 2.5px
          .play-icon
            background-image url("~images/play-pause/play.png")
          .setting-icon
            background-image url("~images/setting.png")
          .volume-icon
            background-image url("~images/volume.png")
          .full-screen-icon
            background-image url("~images/full-screen.png")
        .btn-item:first-child
          float left
          margin-left 0
        .play-btn
          .pause
            background-image url("~images/play-pause/pause.png")
        .rate-btn
          height 30px
          position relative
          .rate-list
            position absolute
            background-color rgba(0, 0, 0, 0.7)
            bottom 60px
            border-radius 4px
            left 50%
            margin-left -45px
            .rate-item
              line-height 35px
              text-align center
              display block
              width 90px
              height 35px
              border-bottom 1px solid $betterGreyColor
              baseTextStyle(14px, $baseWhiteColor)
            .rate-item:last-child
              border none
            .rate-item:hover
              color $lightBlackColor
            .rate-active
              color $lightBlackColor
          .rate-list:after
            content ''
            display inline-block
            border 10px transparent solid
            border-top-color rgba(0, 0, 0, 0.7)
            position absolute
            bottom -20px
            left 50%
            margin-left -10px
            width-height-same(0)
          .rate-btn-active
            background-color $baseGreenColor
        .setting-btn
          display none
        .definition-btn
          height 30px
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
        .full-screen-btn
          .small-screen-icon
            background-image url("~images/small-screen.png")
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
