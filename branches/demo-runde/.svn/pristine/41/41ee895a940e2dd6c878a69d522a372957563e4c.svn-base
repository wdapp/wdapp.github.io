<template>
  <div class="content-wrapper">
    <div class="chats-box" ref="chatsBox">
      <div class="chats-group" ref="chatsGroup">
        <content-chat
          v-for="(message, key) of messages"
          :message="message"
          :key="key"
        ></content-chat>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import ContentChat from "./Chat";
import { log } from "common/utils";
import Mixins from "common/mixins";

export default {
  name: "Content",
  mixins: [Mixins],
  components: {
    ContentChat
  },
  props: {
    messages: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    addEvents() {
      this.on("scrolltobottom", () => {
        log("scrolltobottom");
        this.scrollToBottom();
      });
      this.on("scrollrefresh", () => {
        log("scrollrefresh");
        this.scrollRefresh();
      });
    },
    scrollRefresh() {
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.scroll.refresh();
        this.scroll.scrollToElement(this.$refs.chatsGroup.lastElementChild);
      });
    }
  },
  mounted() {
    const chatsBox = this.$refs.chatsBox;
    this.scroll = new BScroll(chatsBox, {
      scrollbar: {
        fade: true,
        interactive: false
      }
    });
    this.scrollToBottom();
    this.addEvents();
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'
.content-wrapper
  wrapper()
  position relative
  .chats-box
    width-height-full()
    padding 20px
    box-sizing border-box
    overflow hidden
</style>
