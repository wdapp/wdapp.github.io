<template>
  <div class="chat-wrapper">
    <chat-tabs>
      <chat-chats slot="chats"></chat-chats>
      <hd-lists slot="lists"></hd-lists>
    </chat-tabs>
  </div>
</template>

<script>
import ChatTabs from './components/ChatTabs'
const ChatChats = () => ({
  component: import('./components/ChatChats')
})
const hdLists = () => ({
  component: import('common/components/lists/Lists')
})

export default {
  name: 'Chat',
  components: {
    ChatTabs,
    ChatChats,
    hdLists
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .chat-wrapper
    wrapper()
</style>
