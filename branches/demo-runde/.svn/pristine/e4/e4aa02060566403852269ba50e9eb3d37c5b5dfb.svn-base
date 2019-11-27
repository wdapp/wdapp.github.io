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
      const top = (Math.random() * 50) + 150
      const opacity = (Math.random() / 10) + 0.9
      Velocity.RegisterEffect('shake', {
        defaultDuration: 1500,
        calls: [
          [{opacity: opacity, top: -(0.1 * top), left: -(Math.random() * 10)}, 0.125],
          [{opacity: 0.9, top: -(0.2 * top), left: (Math.random() * 10)}, 0.2],
          [{opacity: 0.8, top: -(0.3 * top), left: -((Math.random() * 20) + 10)}, 0.15],
          [{opacity: 0.7, top: -(0.4 * top), left: (Math.random() * 5)}, 0.2],
          [{opacity: 0.5, top: -(0.5 * top), left: -((Math.random() * 35) + 5)}, 0.125],
          [{opacity: 0.3, top: -(0.7 * top), left: (Math.random() * 5)}, 0.1],
          [{opacity: 0.1, top: -(0.9 * top), left: -((Math.random() * 20) + 5)}, 0.5],
          [{opacity: 0, top: -(1 * top), left: -(Math.random() * 10)}, 0.5]
        ]
      })
      Velocity(el, 'shake', {complete: done, queue: false, easing: 'ease-out'})
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
