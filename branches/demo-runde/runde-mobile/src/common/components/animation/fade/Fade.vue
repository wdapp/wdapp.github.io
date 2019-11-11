<template>
  <transition>
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: "Fade"
};
</script>

<style lang="stylus" scoped>
.v-enter, .v-leave-to
  opacity 0
.v-enter-active
  transition opacity .3s
.v-leave-active
  transition opacity .8s
</style>
