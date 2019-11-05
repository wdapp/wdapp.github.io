<template>
  <div class="interaction-wrapper">
    <div class="video-interactions" id="videoInteractions"></div>
    <div class="audio-interactions" id="audioInteractions"></div>
    <div class="preview-wrap" v-show="preview">
      <video
        class="interaction-local-video"
        id="interactionLocalVideo"
        autoplay
      ></video>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Interaction',
  props: {
    preview: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .interaction-wrapper
    .video-interactions
      width-height-full()
    .audio-interactions
      display none
    .preview-wrap
      width-height-full()
      .interaction-local-video
        width-height-full()
</style>
