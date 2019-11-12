<template>
  <div class="main-windows-wrapper">
    <div class="main-wrap" ref="mainParent">
      <!--      <component :is="component"></component>-->
      <live-document ref="document"></live-document>
    </div>
    <slot name="controls"></slot>
  </div>
</template>

<script>
import LiveDocument from "../document/Document";
import FullScreen from "common/fullscreen";
import Mixins from "common/mixins";
import { mapState, mapMutations } from "vuex";

export default {
  name: "MainWindows",
  mixins: [Mixins],
  components: {
    LiveDocument
  },
  props: {
    component: {
      type: String,
      default: "LivePlayer"
    }
  },
  computed: {
    ...mapState(["screenState"])
  },
  methods: {
    ...mapMutations(["changeScreenState"])
  },
  mounted() {
    const target = this.$refs.mainParent;
    this.fullscreen = new FullScreen(
      target,
      () => {
        this.changeScreenState(true);
      },
      () => {
        this.changeScreenState(false);
      }
    );
    this.on("fullscreenclick", () => {
      if (this.screenState) {
        this.fullscreen.exitFullscreen();
      } else {
        this.fullscreen.webFullScreen();
      }
    });
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
