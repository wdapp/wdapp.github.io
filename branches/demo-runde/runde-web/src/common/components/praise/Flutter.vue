<template>
  <transition-group
    class="flutter-wrap"
    ref="group"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <slot></slot>
  </transition-group>
</template>

<script>
import Velocity from 'velocity-animate'
import 'velocity-animate/velocity.ui.js'

export default {
  name: 'Flutter',
  methods: {
    onBeforeEnter (el) {

    },
    onEnter (el, done) {
      const top = (Math.random() * 80) + 50
      const duration = 2000
      const left = (20 - (Math.random() * 80))
      const rand = (Math.random() * 1000)

      el.style.opacity = 1

      Velocity(el, {top: -top, left: left, opacity: 0.8}, {
        duration: duration,
        queue: false,
        easing: 'easeOutQuad',
        complete: () => {
          Velocity(el,
            {opacity: 0, top: -top - (20 - (Math.random() * 80))},
            {duration: rand, complete: done, queue: false, easing: 'easeInSine'})
        }
      })
    },
    onAfterEnter (el) {
      this.$emit('complete')
    },
    onBeforeLeave (el) {

    },
    onLeave (el, done) {
      if (typeof done === 'function') {
        done()
      }
    },
    onAfterLeave (el) {

    }
  }
}
</script>

<style scoped>

</style>
