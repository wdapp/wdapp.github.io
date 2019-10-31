<template>
  <span>
    {{animatedNumber}}
  </span>
</template>

<script>
import {TweenLite} from 'gsap/TweenMax'

export default {
  name: 'TweenLite',
  props: {
    number: {
      type: Number,
      default: 0
    },
    delay: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      currentNumber: 0,
      tweenedNumber: 0
    }
  },
  computed: {
    delayTime () {
      return this.delay / 1000
    },
    animatedNumber: function () {
      return this.tweenedNumber.toFixed(0)
    }
  },
  watch: {
    currentNumber: function (newValue) {
      if (!newValue) {
        return false
      }
      TweenLite.to(this.$data, 1, {tweenedNumber: newValue, delay: this.delayTime})
    }
  },
  mounted () {
    this.currentNumber = this.number
  }
}
</script>

<style scoped>

</style>
