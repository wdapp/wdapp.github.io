<template>
  <div class="main-windows-wrapper">
    <div class="main-wrap" ref="mainParent">
<!--      <component :is="component"></component>-->
      <live-player ref="player"></live-player>
    </div>
    <slot name="controls"></slot>
  </div>
</template>

<script>
import LivePlayer from "../player/Player";
import LiveDocument from "../document/Document";

export default {
  name: "MainWindows",
  components: {
    LivePlayer,
    LiveDocument
  },
  props: {
    component: {
      type: String,
      default: "LivePlayer"
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.main-windows-wrapper
  position relative
  width-height-full()
  .main-wrap
    width-height-full()
</style>
