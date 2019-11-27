<template>
  <div class="sub-windows-wrapper">
    <div class="sub-wrap" v-show="show">
      <div class="close-wrap" v-show="closeable">
        <div class="close-icon"></div>
      </div>
      <component :is="component"></component>
    </div>
  </div>
</template>

<script>
import LivePlayer from "../player/Player";
import LiveDocument from "../document/Document";

export default {
  name: "SubWindows",
  components: {
    LivePlayer,
    LiveDocument
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    closeable: {
      type: Boolean,
      default: true
    },
    component: {
      type: String,
      default: "LivePlayer"
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.sub-windows-wrapper
  position fixed
  top 462px
  left 0
  .sub-wrap
    width 300px
    height 168px
    position relative
    .close-wrap
      position absolute
      top 5px
      right 5px
      .close-icon
        bg-image('close', 40)
</style>
