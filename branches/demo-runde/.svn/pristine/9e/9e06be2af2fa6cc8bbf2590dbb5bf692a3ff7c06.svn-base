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
import Tap from './Tap'
import Flutter from './Flutter'
const Heart = () => ({
  component: import('./Heart')
})

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
      options: [],
      max: 20 // 允许存在的最大心粒子数，心越少，越流畅，性能较差浏览器建议改小
    }
  },
  methods: {
    onTap () {
      this.isTap = !this.isTap
      if (this.options.length > this.max) {
        return
      }
      const rand = parseInt(Math.random() * 5) + 3
      for (let i = 0; i < rand; i++) {
        this.index++
        this.options.push(this.index)
      }
    },
    activeFlutter () {
      this.isTap = !this.isTap
      if (this.options.length > 5) {
        return
      }
      const rand = parseInt(Math.random() * 4) + 1
      for (let i = 0; i < rand; i++) {
        this.index++
        this.options.push(this.index)
      }
    },
    onComplete () {
      this.options.shift()
    }
  },
  mounted () {
    // 每个10-19秒自动点赞
    setInterval(() => {
      const timeout = parseInt(Math.random() * 10)
      setTimeout(() => {
        this.activeFlutter()
      }, timeout)
    }, 10000)
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
