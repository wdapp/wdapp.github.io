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
import HuodeScene from "common/websdk/live";
import Mixins from "common/mixins";
import { log } from "common/utils";

export default {
  name: "Attendance",
  mixins: [Mixins],
  data() {
    return {
      show: false,
      title: "签到",
      sub: "各位同学开始签到",
      status: "",
      timer: 0,
      info: {
        pid: "",
        expireTime: "",
        remainDuration: 0
      }
    };
  },
  computed: {
    count() {
      return this.info.remainDuration + "s";
    },
    isShow() {
      if (this.status === "success" || this.status === "fail") {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    addEvents() {
      this.hd.onStartAttendance(result => {
        log("onStartAttendance", result);
        this.info.pid = result.pid;
        this.info.expireTime = result.expireTime;
        this.info.remainDuration = result.remainDuration;
        this.show = true;
        if (result.expireTime) {
          this.status = "timer";
          this.startTimer();
        }
      });
      this.hd.onEndAttendance(result => {
        log("onEndAttendance", result);
        this.show = false;
      });
    },
    onEnd() {
      this.delay(() => {
        this.show = false;
      }, 2000);
    },
    onClosed() {
      this.stopTimer();
      this.title = "签到";
      this.sub = "各位同学开始签到";
      this.status = "";
      this.timer = 0;
      this.info = {
        pid: "",
        expireTime: "",
        remainDuration: 0
      };
    },
    handleAttendanceClick() {
      const pid = this.info.pid;
      this.hd.submitAttendance(pid, datas => {
        const result = datas.success;
        if (result) {
          const isRepeat = datas.data.isRepeat;
          if (isRepeat) {
            return;
          }
          this.onAttendanceSuccess();
        } else {
          this.onAttendanceFail();
        }
      });
    },
    onAttendanceSuccess() {
      this.status = "success";
      this.title = "恭喜您，签到成功！";
      this.onEnd();
    },
    onAttendanceFail() {
      this.status = "fail";
      this.title = "抱歉，签到失败！";
      this.onEnd();
    },
    update() {
      this.info.remainDuration = this.info.remainDuration - 1;
      if (this.info.remainDuration <= 0) {
        this.stopTimer();
        this.onAttendanceFail();
      }
    },
    startTimer() {
      this.stopTimer();
      this.timer = setInterval(() => {
        this.update();
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = 0;
    }
  },
  mounted() {
    this.hd = new HuodeScene();
    this.addEvents();
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"
.van-popup
  overflow visible
  .attendance-wrapper
    width 585px
    height 480px
    border-radius 8px
    display flex
    flex-direction column
    justify-content space-around
    align-items center
    overflow visible
    .attendance-icon
      line-height 280px
      text-align center
      bg-image("pop/pop_top_icon", 280)
      margin-top -150px
      baseTextStyle(50px, transparent, $boldFontWeight)
    .timer
      color $fff
    .success
      active-image("pop/success")
      color transparent
    .fail
      active-image("pop/fail")
      color transparent
    .attendance-title
      baseTextStyle(36px, $c333, $boldFontWeight)
    .attendance-sub
      baseTextStyle(30px, $c999)
    .attendance-btn
      width 400px
      height 88px
      background $red
      border-radius 44px
      line-height 88px
      text-align center
      baseTextStyle(36px, $fff)
    .hide
      visibility hidden
      opacity 0
</style>
