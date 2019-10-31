<template>
  <transition
    enter-active-class="enter"
    leave-active-class="leave"
  >
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'Tap'
}
</script>

<style lang='stylus' scoped>
  .enter
    animation pulse 1s
  .leave
    animation pulse 1s
  @keyframes pulse {
    0% {
      opacity: 0.8;
      transform: scale(0.5);
    }
    20% {
      opacity: 0.7;
      transform: scale(0.8);
    }
    40% {
      opacity: 0.6;
      transform: scale(1.5);
    }
    60% {
      opacity: 0.4;
      transform: scale(1.6);
    }
    80% {
      opacity: 0.2;
      transform: scale(1.7);
    }
    90% {
      opacity: 0.1;
      transform: scale(1.8);
    }
    100% {
      opacity: .05;
      transform: scale(1.9);
    }
  }
</style>
