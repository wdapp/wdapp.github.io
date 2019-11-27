<template>
  <div :class="chatRight" v-if="isShow">
    <img class="chat-header" :src="message.userAvatar"/>
    <span class="chat-name" v-show="isRight">{{message.userName}}</span>
    <span class="chat-separator" v-show="isRight">:</span>
    <span class="chat-content" v-html="message.content"></span>
  </div>
</template>

<script>
export default {
  name: 'Chats',
  props: {
    show: {
      type: Boolean,
      defaule: true
    },
    type: {
      type: String,
      default: 'left'
    },
    message: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      role: '',
      isShow: true
    }
  },
  computed: {
    chatRight () {
      return this.type === 'right' ? ('chat-item chat-' + this.type) : 'chat-item'
    },
    isRight () {
      return this.type !== 'right'
    }
  },
  watch: {
    show () {
      if (this.message.active) {
        this.isShow = this.show
      } else {
        this.isShow = true
      }
    }
  },
  mounted () {
    this.isShow = this.message.show
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .chat-item
    chat-overflow hidden
    margin-bottom 20px
    width 100%
    baseTextStyle()
    .chat-header
      vertical-align middle
      display inline-block
      width-height-same(30px)
      border-radius 50%
      margin-right 10px
    .chat-name
      vertical-align middle
      display inline-block
      max-width 120px
      color $baseRedColor
      ellipsis()
    .chat-separator
      margin-right 10px
    .self
      color $baseRedColor
    .teacher
      color $baseRedColor
    .assistant
      color $baseRedColor
    .chat-content
      vertical-align middle
      break-world()
      line-height 28px
      >>> img
        vertical-align middle
        margin 0 5px
        width-height-same(30px)
      >>> .img
        width-height-same(auto)
      >>> .cem
        width-height-same(40px)
      >>> .em2
        width-height-same(30px)
      >>> .em2-q
        width-height-same(45px)
  .chat-right
    overflow hidden
    .chat-header, .chat-content
      float right
    .chat-header
      margin-left 12px
    .chat-content
      max-width 352px
</style>
