<template>
  <div class="live-chat-wrapper">
    <live-chat-tabs>
      <live-chat-chats slot="chats"></live-chat-chats>
      <live-lists slot="lists"></live-lists>
    </live-chat-tabs>
  </div>
</template>

<script>
import LiveChatTabs from './components/ChatTabs'
import LiveChatChats from './components/ChatChats'
import LiveLists from './components/LiveLists'

export default {
  name: 'LiveChat',
  components: {
    LiveChatTabs,
    LiveChatChats,
    LiveLists
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .live-chat-wrapper
    wrapper()
</style>
