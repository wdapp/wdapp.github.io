<template>
  <div class="chat-wrapper">
    <chat-tabs>
      <chat-chats slot="chats"></chat-chats>
      <live-lists slot="lists"></live-lists>
    </chat-tabs>
  </div>
</template>

<script>
import ChatTabs from './components/ChatTabs'
import ChatChats from './components/ChatChats'
import LiveLists from './components/LiveLists'

export default {
  name: 'Chat',
  components: {
    ChatTabs,
    ChatChats,
    LiveLists
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .chat-wrapper
    wrapper()
</style>
