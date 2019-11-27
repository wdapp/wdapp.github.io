<template>
  <transition-group
    enter-active-class="animated slideInLeft"
    :duration="duration"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <div
      class="tip-wrapper"
      v-for="tip of options"
      :key="tip.id"
      :style="top(tip.id)"
    >
      <div class="left">
        <p class="tip-name">
          {{ tip.name }}
        </p>
        <p class="tip-content">
          {{ tip.content }}
        </p>
      </div>
      <div class="right">
        <img class="tip-img" :src="tip.imgSrc" />
        <span class="tip-multiple">
          {{ tip.multiple }}
        </span>
        <tween-lite
          class="tip-number"
          :animate="tip.animate"
          :number="tip.number"
          :delay="duration"
        ></tween-lite>
      </div>
    </div>
  </transition-group>
</template>

<script>
import TweenLite from "./TweenLite";

export default {
  name: "Slide",
  components: {
    TweenLite
  },
  props: {
    option: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      max: 2,
      index: 0,
      options: [],
      duration: 500,
      cacheOptions: [],
      timer: 0,
      interval: 1000,
      timeout: 2000
    };
  },
  watch: {
    option() {
      this.index++;
      this.option.id = this.index;
      this.addOptions(this.option);
    }
  },
  computed: {
    fontSize() {
      return parseFloat(
        document.getElementsByTagName("html")[0].style.fontSize
      );
    }
  },
  methods: {
    top(index) {
      const _top = 60 / this.fontSize;
      const top = _top * ((index - 1) % this.max);
      return "top:" + top + "rem";
    },
    addOptions(option) {
      if (this.options.length < this.max && !this.cacheOptions.length) {
        this.stopTimer();
        this.options.push(option);
      } else {
        this.cacheOptions.push(option);
        this.startTimer();
      }
    },
    startTimer() {
      if (this.timer) {
        return false;
      }
      this.timer = setInterval(() => {
        this.timeupdate();
      }, this.interval);
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = 0;
    },
    timeupdate() {
      if (!this.cacheOptions.length) {
        this.stopTimer();
        return false;
      }
      const option = this.cacheOptions.shift();
      this.options.push(option);
    },
    enter(el, done) {
      setTimeout(() => {
        done();
      }, this.timeout);
    },
    afterEnter() {
      this.options.shift();
    },
    leave: function(el, done) {
      done();
    },
    afterLeave: function() {}
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.tip-wrapper
  position absolute
  border-radius 0px 68px 68px 0px; /*no*/
  width 520px
  height 100px
  background linear-gradient(90deg, rgba(255, 113, 129, 1) 0%, rgba(255, 81, 81, 1) 100%)
  padding-left 56px
  box-sizing border-box
  top 0
  .left
    float left
    height 100%
    width 220px
    .tip-name
      width 100%
      ellipsis()
      baseTextStyle(32px, $fff)
      margin-top 15px
    .tip-content
      width 100%
      ellipsis()
      baseTextStyle(26px, $fff)
      margin-top 15px
  .right
    float left
    height 100%
    font-size 50px
    font-family Arial
    font-weight 800
    font-style italic
    color $fff
    -webkit-text-stroke 4px #FF454B; /*no*/
    text-stroke 4px #FF454B; /*no*/
    line-height 100px
    overflow hidden
    max-width 90%
    .tip-img
      width-height-same(70px)
      vertical-align middle
    .tip-multiple
      vertical-align middle
      font-size 48px
    .tip-number
      vertical-align middle
</style>
