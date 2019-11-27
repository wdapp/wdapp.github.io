<template>
  <div class="player-drawpanel-wrapper" :class="size" v-show="status">
    <vue-drag-resize
      ref="Drag"
      class="drag-resize-wrap"
      :isDraggable="drag.isDraggable"
      :isActive="drag.active"
      :isResizable="drag.resizable"
      @dragging="onDragGing"
      @clicked="onClicked($event)"
      @mouseup.native="onMouseup"
    >
      <div v-show="isShowCloseBtn" class="drawpanel-close-btn" @click="onClose">
        <span class="drawpanel-close-icon"></span>
      </div>
      <div class="drawpanel-wrap">
        <div class="drawpanel" id="drawPanel"></div>
      </div>
    </vue-drag-resize>
  </div>
</template>

<script>
import Drag from './drag'

export default {
  name: 'PlayerDrawpanel',
  mixins: [Drag],
  props: {
    isShowClose: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data () {
    return {
      status: false
    }
  },
  computed: {
    isShowCloseBtn () {
      return this.size === 'small' && this.isShowClose
    }
  },
  methods: {
    onClose () {
      this.status = false
      this.$emit('close', this.status)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .player-drawpanel-wrapper
    width-height-full()
    .drag-resize-wrap
      width 100% !important
      height 100% !important
      background-color #DDDDDD
      .drawpanel-wrap
        position absolute
        width-height-full()
        .drawpanel
          position absolute
          width-height-full()
      .drawpanel-close-btn
        position absolute
        top 11px
        right 11px
        z-index 1
        .drawpanel-close-icon
          display inline-block
          background url("~images/close.png") no-repeat
          background-size 30px
          width-height-same(30px)
    .drag-resize-wrap:before
      content ''
      display none
  .small
    position absolute
    width 290px
    height 163px
    top 0
    right 0
    z-index 3
  .large
    width-height-full()
</style>
