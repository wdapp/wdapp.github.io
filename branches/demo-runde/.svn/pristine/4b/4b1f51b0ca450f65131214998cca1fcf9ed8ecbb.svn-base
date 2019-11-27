<template>
  <div
    class="chat-item"
    :class="{ 'chat-right': isRight }"
    v-if="isShow && isNull"
  >
    <img class="chat-header" :src="message.userAvatar" />
    <span class="chat-tag" v-show="role">
      <span class="chat-tag-icon"></span>
      讲师
    </span>
    <span class="chat-name" v-show="!isRight">{{ message.userName }}</span>
    <span class="chat-separator" v-show="!isRight">:</span>
    <span class="chat-content" v-html="message.content"></span>
  </div>
</template>

<script>
export default {
  name: "Chat",
  props: {
    show: {
      type: Boolean,
      default: true
    },
    message: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      isShow: true
    };
  },
  computed: {
    role() {
      return this.message.userRole === "publisher";
    },
    isRight() {
      return this.message.type === "right";
    },
    isNull() {
      const msg = this.message;
      if (typeof msg !== "object" || JSON.stringify(msg) === "{}") {
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {
    show() {
      if (this.message.active) {
        this.isShow = this.show;
      } else {
        this.isShow = true;
      }
    }
  },
  mounted() {
    this.isShow = this.message.show;
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.chat-item
  overflow hidden
  margin-bottom 40px
  width 100%
  baseTextStyle()
  .chat-header
    vertical-align middle
    display inline-block
    width-height-same(60px)
    border-radius 50%
    margin-right 20px
  .chat-tag
    width 80px
    height 34px
    background-color $red
    border-radius 4px
    baseTextStyle(22px, $fff)
    line-height 34px
    margin-right 4px
    vertical-align middle
    .chat-tag-icon
      vertical-align middle
      bg-image('tag/tag', 25)
  .chat-name
    vertical-align middle
    display inline-block
    max-width 240px
    color $c999
    ellipsis()
  .chat-separator
    margin-right 20px
  .self
    color $c999
  .teacher
    color $red
  .assistant
    color $red
  .chat-content
    vertical-align middle
    break-world()
    line-height 46px
    >>> img
      vertical-align middle
      margin 0 10px
      width-height-same(60px)
    >>> .img
      width 100%
      height auto
    >>> .cem
      width-height-same(80px)
    >>> .em2
      width-height-same(60px)
    >>> .em2-q
      width-height-same(90px)
.chat-right
  overflow hidden
  .chat-header, .chat-content
    float right
  .chat-header
    margin-left 24px
  .chat-content
    max-width 75%
</style>
