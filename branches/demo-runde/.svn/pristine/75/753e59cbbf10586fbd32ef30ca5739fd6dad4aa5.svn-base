<template>
  <div class="wrapper">
    <div class="top">
      <live-windows>
        <live-controls slot="controls"></live-controls>
      </live-windows>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script>
import LiveWindows from "./components/windows/Windows";
import LiveControls from "./components/controls/Controls";

export default {
  name: "Live",
  components: {
    LiveWindows,
    LiveControls
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'

.wrapper
  wrapper()
  position absolute
  .top
    height 462px
  .bottom
    layout(462px, 0, 0, 0)
</style>
