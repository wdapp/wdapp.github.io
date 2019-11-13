<template>
  <div class="content-wrapper">
    <div class="chats-container" ref="Container">
      <div class="chats-group" ref="Group">
        <content-chat
          v-for="(message, key) of messages"
          :message="message"
          :key="key"
          :show="checked"
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
    },
    checked: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    Container() {
      return this.$refs.Container;
    },
    Group() {
      return this.$refs.Group;
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
        const lastElementChild = this.Group.lastElementChild;
        if (!lastElementChild) {
          return false;
        }
        this.scroll.refresh();
        this.scroll.scrollToElement(lastElementChild);
      });
    }
  },
  mounted() {
    const Container = this.Container;
    this.scroll = new BScroll(Container, {
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
  .chats-container
    width-height-full()
    padding 20px
    box-sizing border-box
    overflow hidden
</style>
