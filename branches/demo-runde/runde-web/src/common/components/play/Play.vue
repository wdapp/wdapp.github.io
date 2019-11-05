<template>
  <hd-fade>
    <div
      class="play-wrapper"
      @click="handlePlayClick"
      v-show="isShowPlay"
    >
      <div class="screen-play-btn-wrap">
      <span
        class="screen-play-btn"
        :class="{'screen-pause': status}"
      ></span>
      </div>
    </div>
  </hd-fade>
</template>

<script>
import hdFade from 'common/components/fade/Fade'

export default {
  name: 'Play',
  components: {
    hdFade
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      timer: 0,
      interval: 3000,
      isShowPlay: true
    }
  },
  watch: {
    status () {
      this.startTimer()
    }
  },
  methods: {
    handlePlayClick () {
      this.startTimer()
      this.$emit('play')
    },
    startTimer () {
      this.timer && this.stopTimer()
      this.isShowPlay = true
      this.timer = setTimeout(() => {
        this.isShowPlay = false
        this.timer = 0
      }, this.interval)
    },
    stopTimer () {
      clearTimeout(this.timer)
      this.timer = 0
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .play-wrapper
    width-height-same(90px)
    .screen-play-btn-wrap
      width-height-same(90px)
      .screen-play-btn
        display inline-block
        width-height-same(90px)
        background url("~images/play-pause/screen-play.png") no-repeat
        background-size 90px
      .screen-pause
        background-image url("~images/play-pause/screen-pause.png")
</style>
