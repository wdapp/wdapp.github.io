<template>
  <span class="play-wrapper" :class="{ active: playStatus }"></span>
</template>

<script>
export default {
  name: "Play",
  props: {
    playStatus: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.play-wrapper
  bg-image('big-play', 90)
.active
  active-image('big-pause')
</style>
