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
  data() {
    return {
      messages: [
        {
          userAvatar: require("images/header.png"),
          userName: "1231232132131321321321",
          content: "开始，大家好大家好",
          type: "left"
        },
        {
          userAvatar: require("images/header.png"),
          userName: "测试",
          content: "12312321",
          type: "left"
        },
        {
          userAvatar: require("images/header.png"),
          userName: "测试",
          content:
            "大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好大家好",
          type: "right"
        },
        {
          userAvatar: require("images/header.png"),
          userName: "测试",
          content: "大家好大家好",
          type: "left"
        },
        {
          userAvatar: require("images/header.png"),
          userName: "测试",
          content:
            "hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world ",
          type: "left"
        },
        {
          userAvatar: require("images/header.png"),
          userName: "测试",
          content: "大家好大家好，right",
          type: "right"
        },
        {
          userAvatar: require("images/header.png"),
          userName: "sadfdsafdsafdsafdsafdasfds",
          content: "大家好大家好",
          type: "left"
        },
        {
          userAvatar: require("images/header.png"),
          userName:
            "&^%$#%^&*(UYFTYGHUJKHCVHU&^%$%^&*())(*&^%$#@!@#$%^&*&^%$#%^&*(UYFTYGHUJKHCVHU&^%$%^&*())(*&^%$#@!@#$%^&*",
          content: "大家好大家好",
          type: "left"
        },
        {
          userAvatar: require("images/header.png"),
          userName: "sadfdsafdsafdsafdsafdasfds",
          content: "大家好大家好",
          type: "left"
        },
        {
          userAvatar: require("images/header.png"),
          userName: "sadfdsafdsafdsafdsafdasfds",
          content: "大家好大家好",
          type: "left"
        },
        {
          userAvatar: require("images/header.png"),
          userName: "sadfdsafdsafdsafdsafdasfds",
          content: "这里是测试的地方，结束",
          type: "left"
        }
      ]
    };
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
    this.scroll = new BScroll(chatsBox);
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
