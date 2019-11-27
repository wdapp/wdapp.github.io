<template>
  <div class="slider-wrapper">
    <div class="slider-box">
      <el-slider
        v-model="value"
        :min="min"
        :max="duration"
        :step="step"
        :show-tooltip="false"
        @change="onSeek"
        @mousedown.native="onMouseDown"
      ></el-slider>
    </div>
  </div>
</template>

<script>
import {log} from 'common/utils'

export default {
  name: 'Slider',
  props: {
    duration: {
      type: Number,
      default: 100
    },
    currentTime: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      min: 0,
      step: 1,
      value: 0
    }
  },
  watch: {
    currentTime () {
      this.value = this.currentTime
    }
  },
  methods: {
    onSeek (value) {
      this.$emit('seek', value)
    },
    onMouseDown () {
      const self = this
      self.mouseTap = true
      log('onMouseDown')
      document.onmousemove = function () {
        self.onMouseMove()
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
        log('onmouseup')
      }
    },
    onMouseMove () {
      this.$emit('move')
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .slider-wrapper
    width-height-full()
    .slider-box
      position relative
      height 4px
      >>> .el-slider
        height 4px
        .el-slider__runway
          margin 0
          height 4px
          background-color $betterGreyColor
          .el-slider__bar
            background-color $baseOrangeColor
          .el-slider__button-wrapper
            .el-slider__button
              border none
              width-height-same(12px)
              background-color $baseOrangeColor
              box-shadow 0 0 4px 2px $baseOrangeColor
</style>
