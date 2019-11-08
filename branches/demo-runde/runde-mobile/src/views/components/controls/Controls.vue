<template>
  <div class="controls-wrapper">
    <div class="controls-top">
      <controls-back class="controls-back"></controls-back>
      <controls-button-group
        class="controls-button-group"
      ></controls-button-group>
      <controls-play class="controls-play"></controls-play>
    </div>
    <div class="controls-bottom">
      <controls-control></controls-control>
    </div>
  </div>
</template>

<script>
import ControlsPlay from "./components/Play";
import ControlsBack from "./components/Back";
import ControlsControl from "./components/Control";
import ControlsButtonGroup from "./components/ButtonGroup";

export default {
  name: "Controls",
  components: {
    ControlsPlay,
    ControlsBack,
    ControlsControl,
    ControlsButtonGroup
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.controls-wrapper
  position absolute
  width-height-full()
  top 0
  .controls-top
    layout(0, 0, 77px, 0)
    .controls-back
      margin-left 20px
      margin-top 14px
    .controls-button-group
      float right
      margin-right 18px
      margin-top 16px
    .controls-play
      position absolute
      left 50%
      top 50%
      margin-left -45px
      margin-top -6.5px
  .controls-bottom
    position absolute
    width 100%
    height 77px
    bottom 0
</style>
