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
      const top = (Math.random() * 80) + 150
      const opacity = (Math.random() / 10) + 0.9
      const duration = (Math.random() * 250) + 1000
      Velocity.RegisterEffect('shake', {
        defaultDuration: duration,
        calls: [
          [{opacity: opacity, left: -(Math.random() * 5)}, 0.125],
          [{opacity: 0.9, left: (Math.random() * 5)}, 0.125],
          [{opacity: 0.8, left: -((Math.random() * 5) + 5)}, 0.125],
          [{opacity: 0.7, left: (Math.random() * 5) + 5}, 0.125],
          [{opacity: 0.5, left: -((Math.random() * 5) + 5)}, 0.125],
          [{opacity: 0.3, left: (Math.random() * 2.5)}, 0.125],
          [{opacity: 0.1, left: -(Math.random() * 1.5)}, 0.125],
          [{opacity: 0, left: (Math.random() * 1)}, 0.125]
        ]
      })
      Velocity(el, 'shake', {queue: false, easing: 'easeInOutQuad'})
      Velocity(el, {top: -top}, {duration: duration, complete: done, queue: false, easing: 'easeOutQuad'})
    },
    onAfterEnter (el) {
      this.$emit('complete')
    },
    onBeforeLeave (el) {

    },
    onLeave (el, done) {
      done()
    },
    onAfterLeave (el) {

    }
  }
}
</script>

<style scoped>

</style>
