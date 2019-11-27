<template>
  <div class="windows-wrapper">
    <div class="main-wrap">
      <component :is="toggleComponent(toggle)"></component>
    </div>
    <div class="sub-wrap">
      <div class="sub-windows">
        <div class="close-wrap">
          <div class="close-icon"></div>
        </div>
        <component :is="toggleComponent(!toggle)"></component>
      </div>
      <div
        class="sub-panel"
        :class="{ 'sub-bespread': subBespread }"
        v-show="showPanel"
      >
        <windows-panel :arrange="arrange"></windows-panel>
      </div>
    </div>
    <slot name="controls"></slot>
  </div>
</template>

<script>
import WindowsPlayer from "../player/Player";
import WindowsDocument from "../document/Document";
import WindowsPanel from "./components/Panel";

export default {
  name: "Windows",
  components: {
    WindowsPlayer,
    WindowsDocument,
    WindowsPanel
  },
  data() {
    return {
      mainComponent: "WindowsPlayer",
      subComponent: "WindowsDocument",
      toggle: true,
      subBespread: false,
      showPanel: false
    };
  },
  computed: {
    arrange() {
      const range = this.subBespread ? "line" : "response";
      return range;
    }
  },
  methods: {
    toggleComponent(toggle) {
      const _toggle = toggle;
      const main = this.mainComponent;
      const sub = this.subComponent;
      const is = _toggle ? main : sub;
      return is;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.windows-wrapper
  position relative
  width-height-full()
  .main-wrap
    width-height-full()
  .sub-wrap
    position absolute
    width 100%
    height 168px
    top 462px
    left 0
    z-index 1
    .sub-windows
      width 300px
      height 168px
      position relative
      z-index 1
      .close-wrap
        position absolute
        top 5px
        right 5px
        .close-icon
          bg-image('close', 40)
    .sub-panel
      layout(0, 0, 0, 300px)
      height 168px
      border-bottom 1px $ddd solid
    .sub-bespread
      left 0
      height 84.5px
</style>
