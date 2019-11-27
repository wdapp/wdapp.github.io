<template>
  <div class="praise-wrapper">
    <flutter
      @complete="onComplete"
    >
      <heart
        class="heart-wrap"
        v-for="item of options"
        :key="item"
      ></heart>
    </flutter>
    <tap>
      <div
        class="praise-tap"
        v-show="isTap"
      ></div>
    </tap>
    <div
      class="praise-btn-wrap"
      @click="onTap"
    >
      <span class="praise-btn-icon"></span>
    </div>
  </div>
</template>

<script>
import Heart from './Heart'
import Tap from './Tap'
import Flutter from './Flutter'

export default {
  name: 'HDPraise',
  components: {
    Heart,
    Tap,
    Flutter
  },
  data () {
    return {
      isTap: false,
      index: 0,
      options: []
    }
  },
  methods: {
    onTap () {
      this.isTap = !this.isTap
      if (this.options.length > 10) {
        return
      }
      this.index++
      this.options.push(this.index)
    },
    onComplete () {
      this.options.shift()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .praise-wrapper
    position relative
    width-height-same(40px)
    .praise-btn-wrap
      position absolute
      width-height-same(40px)
      .praise-btn-icon
        display inline-block
        width-height-same(40px)
        background url('~images/praise.png') no-repeat
        background-size 40px
    .praise-tap
      position absolute
      background-color pink
      top 0
      border-radius 50%
      width-height-same(40px)
      opacity 0
</style>
