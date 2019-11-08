<template>
  <div class="sub-wrapper" v-show="show">
    <div class="sub-windows" v-show="showSubWindows"></div>
    <div class="sub-panel">
      <panel :name="name" :number="number"></panel>
    </div>
  </div>
</template>

<script>
import Panel from "./components/Panel";

export default {
  name: "PanelIndex",
  components: {
    Panel
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    showSubWindows: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ""
    },
    number: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.sub-wrapper
  width 100%
  border-bottom 1px $ddd solid
  display flex
  flex-direction row
  .sub-windows
    width 300px
    height 168px
    position relative
  .sub-panel
    flex 1
</style>
