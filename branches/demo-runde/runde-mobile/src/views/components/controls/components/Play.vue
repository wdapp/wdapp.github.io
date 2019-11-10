<template>
  <span
    @click="handlePlayClick"
    class="play-wrapper"
    :class="{ active: playState }"
  ></span>
</template>

<script>
export default {
  name: "Play",
  props: {
    playState: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handlePlayClick() {
      this.$emit("toggleplay");
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
