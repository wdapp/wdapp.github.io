<template>
  <van-popup class="popup-wrapper" v-model="show">
    <div class="attendance-wrapper">
      <span class="attendance-icon" :class="result">
        {{ timer }}
      </span>
      <div class="attendance-title">
        {{ title }}
      </div>
      <div class="attendance-sub" v-show="!result">
        {{ sub }}
      </div>
      <div class="attendance-btn" @click="handleAttendanceClick" v-show="!result">
        签到
      </div>
    </div>
  </van-popup>
</template>

<script>
import HuodeScene from "common/websdk/live";
import { log } from "common/utils";

export default {
  name: "Attendance",
  data() {
    return {
      show: true,
      title: "签到",
      sub: "各位同学开始签到",
      time: 30,
      result: "",
      interval: 0,
      info: {
        pid: "",
        time: 0
      }
    };
  },
  computed: {
    timer() {
      return this.time + "s";
    }
  },
  methods: {
    addEvents() {
      this.hd.onStartAttendance((result) => {
        log("onStartAttendance", result);
        this.info = result;
        this.show = true;
      });
      this.hd.onEndAttendance((result) => {
        log("onEndAttendance", result);
        this.show = false;
      });
    },
    handleAttendanceClick() {
      const pid = this.info.pid;
      this.hd.submitAttendance(pid, (result) => {
        if (result.success) {
          this.result = "success";
          this.title = "恭喜您，签到成功！";
        } else {
          this.result = "fail";
          this.title = "抱歉，签到失败！";
        }
      });
    },
    update() {
      this.info.time
      // this.time =
    },
    startTimeout() {
      this.stopTimeout();
      this.interval = setTimeout(() => {
        this.update();
        this.interval = 0;
      }, 1000);
    },
    stopTimeout() {
      this.interval && clearTimeout(this.interval);
      this.interval = 0;
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
      baseTextStyle(50px, $fff, $boldFontWeight)
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
</style>