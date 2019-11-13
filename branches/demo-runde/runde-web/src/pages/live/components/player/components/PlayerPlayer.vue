<template>
  <div class="player-player-wrapper" :class="size">
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
      <div v-show="isShowCloseBtn" class="player-close-btn" @click="onClose">
        <span class="player-close-icon"></span>
      </div>
      <hd-interaction v-show="isShowInteraction" class="live-player"></hd-interaction>
      <div class="live-player" id="livePlayer"></div>
    </vue-drag-resize>
  </div>
</template>

<script>
import Drag from './drag'
import hdInteraction from 'common/components/interaction/Interaction'

export default {
  name: 'PlayerPlayer',
  mixins: [Drag],
  components: {
    hdInteraction
  },
  props: {
    isShowClose: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'large'
    }
  },
  data () {
    return {
      status: true,
      isShowInteraction: false
    }
  },
  computed: {
    isShowCloseBtn () {
      return this.size === 'small' && this.isShowClose
    },
    interactionSmall () {
      return 'interaction-' + this.size
    }
  },
  methods: {
    onClose () {
      this.status = false
      this.$emit('close', this.status)
    },
    onEvents () {
      this.bus.$on('interactionStatus', (status) => {
        if (status === 'interacted') {
          this.isShowInteraction = true
        } else {
          this.isShowInteraction = false
        }
      })
    }
  },
  mounted () {
    this.onEvents()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .player-player-wrapper
    width-height-full()
    .drag-resize-wrap
      width 100% !important
      height 100% !important
      background-color #333333
      .live-player
        position absolute
        width-height-full()
      .player-close-btn
        position absolute
        top 11px
        right 11px
        z-index 1
        .player-close-icon
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
