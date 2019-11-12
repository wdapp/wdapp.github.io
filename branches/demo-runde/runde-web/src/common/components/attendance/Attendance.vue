<template>
  <van-popup class="popup-wrapper" v-model="show" @closed="onClosed">
    <div class="attendance-wrapper">
      <span class="attendance-icon" :class="status">
        {{ count }}
      </span>
      <div class="attendance-title">
        {{ title }}
      </div>
      <div class="attendance-sub" :class="{ hide: isShow }">
        {{ sub }}
      </div>
      <div
        class="attendance-btn"
        @click="handleAttendanceClick"
        :class="{ hide: isShow }"
      >
        签到
      </div>
    </div>
  </van-popup>
</template>

<script>
import HuodeScene from 'common/websdk/live'
import VanPopup from 'vant/lib/popup'
import 'vant/lib/button/style'
import Mixins from 'common/mixins'
import { log } from 'common/utils'

export default {
  name: 'Attendance',
  mixins: [Mixins],
  components: {
    VanPopup
  },
  data () {
    return {
      show: false,
      title: '签到',
      sub: '各位同学开始签到',
      status: '',
      timer: 0,
      info: {
        pid: '',
        expireTime: '',
        remainDuration: 0
      }
    }
  },
  computed: {
    count () {
      return this.info.remainDuration + 's'
    },
    isShow () {
      if (this.status === 'success' || this.status === 'fail') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    addEvents () {
      this.hd.onStartAttendance(result => {
        log('onStartAttendance', result)
        this.info.pid = result.punchId
        this.info.expireTime = result.expireTime
        this.info.remainDuration = result.remainDuration
        this.show = true
        if (result.expireTime) {
          this.status = 'timer'
          this.startTimer()
        }
      })
      this.hd.onEndAttendance(result => {
        log('onEndAttendance', result)
        this.show = false
      })
    },
    onEnd () {
      this.delay(() => {
        this.show = false
      }, 2000)
    },
    onClosed () {
      this.stopTimer()
      this.title = '签到'
      this.sub = '各位同学开始签到'
      this.status = ''
      this.timer = 0
      this.info = {
        pid: '',
        expireTime: '',
        remainDuration: 0
      }
    },
    handleAttendanceClick () {
      const pid = this.info.pid
      this.hd.submitAttendance(pid, datas => {
        const result = datas.success
        if (result) {
          const isRepeat = datas.data.isRepeat
          if (isRepeat) {
            return
          }
          this.onAttendanceSuccess()
        } else {
          this.onAttendanceFail()
        }
      })
    },
    onAttendanceSuccess () {
      this.status = 'success'
      this.title = '恭喜您，签到成功！'
      this.onEnd()
    },
    onAttendanceFail () {
      this.status = 'fail'
      this.title = '抱歉，签到失败！'
      this.onEnd()
    },
    update () {
      this.info.remainDuration = this.info.remainDuration - 1
      if (this.info.remainDuration <= 0) {
        this.stopTimer()
        this.onAttendanceFail()
      }
    },
    startTimer () {
      this.stopTimer()
      this.timer = setInterval(() => {
        this.update()
      }, 1000)
    },
    stopTimer () {
      clearInterval(this.timer)
      this.timer = 0
    }
  },
  mounted () {
    this.hd = new HuodeScene()
    this.addEvents()
  }
}
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.van-popup
  position absolute
  left 50%
  top 50%
  margin-top -116.5px
  margin-left -115px
  overflow visible
  z-index 1
  .attendance-wrapper
    width 230px
    height 233px
    border-radius 8px
    background-color $baseWhiteColor
    border 1px solid #dddddd
    .attendance-icon
      line-height 140px
      text-align center
      bg-image("pop/pop_top_icon", 140)
      baseTextStyle(30px, transparent, $boldFontWeight)
      position absolute
      left 50%
      margin-left -70px
      top -60px
    .timer
      color $baseWhiteColor
    .success
      active-image("pop/success")
      color transparent
    .fail
      active-image("pop/fail")
      color transparent
    .attendance-title
      margin-top 81px
      text-align center
      baseTextStyle(20px, #333333, $boldFontWeight)
    .attendance-sub
      margin-top 17px
      baseTextStyle(20px, #999999)
      text-align center
    .attendance-btn
      margin 0 auto
      margin-top 29px
      width 170px
      height 46px
      background $baseRedColor
      border-radius 4px
      line-height 46px
      text-align center
      baseTextStyle(18px, $baseWhiteColor)
    .hide
      visibility hidden
      opacity 0
</style>
