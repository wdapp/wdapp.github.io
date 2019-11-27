<template>
  <div class="controls-wrapper" @click="handleControlsClick">
    <common-danmaku class="danmaku-wrap" ref="danmaku"></common-danmaku>
    <div
      class="controls-top"
      v-show="show"
      @click.self.stop="onControlsTopClick"
    >
      <controls-back
        class="controls-back"
        @click="handleControlsClick"
      ></controls-back>
      <controls-button-group
        class="controls-button-group"
        @click="handleControlsClick"
        @switch="onSwitch"
        @open="onOpen"
        :isSubShow="isSubShow"
        :hideSwitchBtn="hideSwitchBtn"
      ></controls-button-group>
      <controls-play
        :playState="playState"
        class="controls-play"
        @toggleplay="onTogglePlay"
        @click="handleControlsClick"
      ></controls-play>
    </div>
    <div class="controls-bottom" v-show="show">
      <controls-control
        @toggleplay="onTogglePlay"
        :playState="playState"
        @fullscreenclick="onFullScreen"
        :fullScreenState="screenState"
        @change="onDanmakuChange"
      ></controls-control>
    </div>
  </div>
</template>

<script>
import ControlsPlay from "./components/Play";
import ControlsBack from "./components/Back";
import ControlsControl from "./components/Control";
import ControlsButtonGroup from "./components/ButtonGroup";
import CommonDanmaku from "common/components/danmaku/Danmaku";
import { mapState } from "vuex";
import Mixins from "common/mixins";

export default {
  name: "Controls",
  mixins: [Mixins],
  components: {
    ControlsPlay,
    ControlsBack,
    ControlsControl,
    ControlsButtonGroup,
    CommonDanmaku
  },
  props: {
    isSubShow: {
      type: Boolean,
      default: true
    },
    hideSwitchBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: true,
      checked: false
    };
  },
  computed: {
    ...mapState(["playState", "screenState"]),
    danmaku() {
      return this.$refs.danmaku;
    }
  },
  methods: {
    onSwitch(toggle) {
      this.$emit("switch", toggle);
    },
    onOpen() {
      this.$emit("open");
    },
    handleControlsClick() {
      this.show = true;
      this.$emit("show", this.show);
      this.start();
    },
    onControlsTopClick() {
      this.show = false;
      this.$emit("show", this.show);
      this.abort();
    },
    start() {
      this.delay(() => {
        this.show = false;
        this.$emit("show", this.show);
      });
    },
    onTogglePlay() {
      //自定义发布订阅事件，this.bus.$emit 用于组件之间全局通信，发送主动播放事件
      this.emit("toggleplay");
    },
    onFullScreen() {
      this.emit("fullscreenclick");
    },
    onDanmakuChange(checked) {
      this.checked = checked;
    },
    sendDanmaku(msg) {
      if (this.checked) {
        this.danmaku.sendDanmaku({
          msg: msg
        });
      }
    },
    addEvents() {
      this.on("danmaku", msg => {
        this.sendDanmaku(msg);
      });
    }
  },
  mounted() {
    this.start();
    this.addEvents();
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.controls-wrapper
  position absolute
  width-height-full()
  top 0
  .danmaku-wrap
    position absolute
    top 0
  .controls-top
    layout(0, 0, 77px, 0)
    .controls-back
      display inline-block
      margin-left 20px
      margin-top 14px
    .controls-button-group
      float right
      margin-right 18px
      margin-top 16px
    .controls-play
      position absolute
      left 50%
      top 50%
      margin-left -45px
      margin-top -6.5px
  .controls-bottom
    position absolute
    width 100%
    height 77px
    bottom 0
</style>
