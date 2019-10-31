<template>
  <div class="chat-wrapper">
    <chat-tabs>
      <chat-chats slot="chats" v-show="isShowChats"></chat-chats>
      <div class="chat-tip-wrap" slot="chats">
        <div class="chat-tip">
          <p>回放视频</p>
          <p>暂无聊天记录</p>
        </div>
      </div>
      <hd-lists slot="lists"></hd-lists>
    </chat-tabs>
  </div>
</template>

<script>
import ChatTabs from './components/ChatTabs'
import ChatChats from './components/ChatChats'
import hdLists from 'common/components/lists/Lists'

export default {
  name: 'Chat',
  components: {
    ChatTabs,
    ChatChats,
    hdLists
  },
  data () {
    return {
      isShowChats: false
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .chat-wrapper
    wrapper()
    .chat-tip-wrap
      width-height-full()
      .chat-tip
        position absolute
        top 50%
        left 50%
        margin-top -60px
        margin-left -56px
        width 112px
        height 50px
        line-height 30px
        text-align center
        baseTextStyle(16px, $betterGreyColor)
</style>
