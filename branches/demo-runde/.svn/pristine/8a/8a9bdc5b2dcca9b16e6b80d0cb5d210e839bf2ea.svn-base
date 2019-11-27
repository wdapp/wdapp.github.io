<template>
  <div class="chats-wrapper">
    <div class="chats-container">
      <div class="chats-top">
        <chats-content :messages="messages"></chats-content>
      </div>
      <div class="chats-bottom">
        <chats-footer
          @emoticonclick="onEmoticonClick"
          @plusclick="onPlusClick"
          @closepopup="onClosePopup"
          @messages="onMessages"
        ></chats-footer>
      </div>
    </div>
    <div class="popup-bottom" ref="Popup">
      <componen :is="popup.component"></componen>
    </div>
  </div>
</template>

<script>
import ChatsContent from "./components/Content";
import ChatsFooter from "./components/Footer";
import CommonEmoticon from "components/emoticon/Emoticon";
import CommonPlus from "components/plus/Plus";
import { bind, clear } from "size-sensor";
import { log } from "common/utils";
import Mixins from "common/mixins";

export default {
  name: "Chats",
  mixins: [Mixins],
  components: {
    ChatsContent,
    ChatsFooter,
    CommonEmoticon,
    CommonPlus
  },
  data() {
    return {
      popup: {
        component: ""
      },
      messages: [] // 所有聊天信息
    };
  },
  computed: {
    Popup() {
      return this.$refs.Popup;
    }
  },
  methods: {
    onSizeSensor() {
      this.unbind = bind(this.Popup, element => {
        const height = element.clientHeight;
        if (height > 0) {
          this.emit("popupup");
          log("popupup");
        }

        if (height <= 0) {
          this.emit("popudown");
          log("popudown");
        }

        this.emit("popupchange");

        this.emit("scrolltobottom");
      });
    },
    onEmoticonClick(options) {
      this.popup.component = options.component;
    },
    onPlusClick(options) {
      this.popup.component = options.component;
    },
    closePopup() {
      this.popup.component = false;
    },
    onClosePopup() {
      this.closePopup();
    },
    onMessages(messages) {
      this.messages = messages;
    }
  },
  mounted() {
    this.onSizeSensor();
  },
  beforeDestroy() {
    clear(this.Popup);
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'
.chats-wrapper
  width-height-full()
  display flex
  flex-direction column
  .chats-container
    position relative
    flex 1
    .chats-top
      layout(0, 0, 98px, 0)
    .chats-bottom
      position absolute
      bottom 0
      height 98px
      width 100%
  .popup-bottom
    height auto
</style>
