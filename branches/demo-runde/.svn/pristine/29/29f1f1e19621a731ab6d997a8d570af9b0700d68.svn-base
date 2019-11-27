<template>
  <div class="sub-windows-wrapper" :class="course">
    <vue-drag-resize
      :isActive="drag.active"
      :isResizable="drag.resizable"
      :w="dragWidtch"
      :h="dragHeight"
      @dragging="onDragGing"
      @clicked="onClicked($event)"
      @touchend.native="onTouchend"
      ref="Drag"
    >
      <div class="sub-wrap" v-show="show" ref="subParent">
        <div class="close-wrap" v-show="showClose">
          <div class="close-icon"></div>
        </div>
        <!--      <component :is="component" ref="component"></component>-->
        <live-player ref="player"></live-player>
      </div>
    </vue-drag-resize>
  </div>
</template>

<script>
import LivePlayer from "../player/Player";
import Mixins from "common/mixins";
import VueDragResize from "vue-drag-resize";
import { log } from "common/utils";

export default {
  name: "SubWindows",
  mixins: [Mixins],
  components: {
    LivePlayer,
    VueDragResize
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: "public"
    },
    closeable: {
      type: Boolean,
      default: true
    },
    component: {
      type: String,
      default: "LivePlayer"
    }
  },
  data() {
    return {
      showClose: true,
      drag: {
        active: true,
        resizable: false,
        width: 300,
        height: 168,
        rectangle: {
          width: 0,
          height: 0,
          top: 0,
          left: 0
        }
      }
    };
  },
  watch: {
    closeable(newValue) {
      this.showClose = newValue;
    },
    show(newValue) {
      this.showClose = newValue;
      this.reset();
    }
  },
  computed: {
    fontSize() {
      return parseFloat(
        document.getElementsByTagName("html")[0].style.fontSize
      );
    },
    dragWidtch() {
      let width = this.drag.width;
      const size = 75;
      width = (width / size) * this.fontSize;
      return width;
    },
    dragHeight() {
      let height = this.drag.height;
      const size = 75;
      height = (height / size) * this.fontSize;
      return height;
    },
    course() {
      const type = this.type;
      return type + "-course";
    },
    Drag() {
      return this.$refs.Drag;
    }
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    handleSubClick() {
      this.showClose = !this.showClose;
      if (this.showClose) {
        this.delay(() => {
          this.showClose = false;
        });
      } else {
        this.abort();
      }
    },
    onClicked(event) {
      const target = event.target;
      if (target.className === "close-icon") {
        this.handleClose();
      } else {
        this.handleSubClick();
      }
    },
    onDragGing(rectangle) {
      this.drag.rectangle.width = rectangle.width;
      this.drag.rectangle.height = rectangle.height;
      this.drag.rectangle.top = rectangle.top;
      this.drag.rectangle.left = rectangle.left;
      this.intersectsRect({
        rect: this.drag.rectangle,
        enter: () => {
          this.enter();
        },
        leave: () => {
          this.leave();
        }
      });
    },
    onTouchend() {
      this.intersectsRect({
        rect: this.drag.rectangle,
        enter: () => {
          this.reset();
        }
      });
    },
    intersectsRect(options) {
      const rect = options.rect;
      const height = rect.height;
      const rectTop = rect.top;
      if (rectTop >= 0 && rectTop <= height) {
        options.enter && options.enter();
      } else {
        options.leave && options.leave();
      }
    },
    enter() {
      this.$emit("dragenter");
      log("dragenter");
    },
    leave() {
      this.$emit("dragleave");
      log("dragleave");
    },
    reset() {
      this.Drag.$el.style.top = 0;
      this.Drag.$el.style.left = 0;
      this.$emit("reset");
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.sub-windows-wrapper
  position absolute
  left 0
  top 462px
  z-index 1
  width 300px
  height 168px
  .vdr.active:before
    display none
  .sub-wrap
    width 300px
    height 168px
    position relative
    .close-wrap
      position absolute
      top 10px
      right 10px
      z-index 1
      .close-icon
        bg-image('close', 40)
.special-course
  top 542px
</style>
