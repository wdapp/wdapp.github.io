<template>
  <div class="chats-wrapper">
    <div class="chats-container">
      <div class="chats-top">
        <chats-content :messages="messages" :checked="!checked"></chats-content>
      </div>
      <div class="chats-bottom">
        <div class="leach-like-wrap">
          <div class="leach-wrap">
            <van-checkbox
              class="leach"
              v-model="checked"
              @change="onChange"
              checked-color="#FF454B"
            >
              只看老师
            </van-checkbox>
          </div>
          <div class="like-wrap">
            <common-praise class="praise-wrap"></common-praise>
          </div>
        </div>
        <chats-footer
          @emoticonclick="onEmoticonClick"
          @plusclick="onPlusClick"
          @closepopup="onClosePopup"
          @messages="onMessages"
          :checked="checked"
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
import CommonPraise from "common/components/praise/Praise";

export default {
  name: "Chats",
  mixins: [Mixins],
  components: {
    ChatsContent,
    ChatsFooter,
    CommonEmoticon,
    CommonPlus,
    CommonPraise
  },
  data() {
    return {
      checked: false,
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
      this.closePopup();
    },
    onChange() {
      this.emit("scrolltobottom");
    },
    addEvents() {
      this.on("closeBottomPopup", () => {
        this.closePopup();
      });
    }
  },
  mounted() {
    this.onSizeSensor();
    this.addEvents();
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
      layout(0, 0, 198px, 0)
    .chats-bottom
      position absolute
      bottom 0
      height 198px
      width 100%
      .leach-like-wrap
        display flex
        align-items center
        justify-content space-between
        flex-direction row
        padding 0 30px
        box-sizing border-box
        height 100px
        width 100%
        background linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)
        .leach-wrap
          baseTextStyle(24px, $c666)
          height 40px
          .leach
            height 40px
            .van-icon
              width-height-same(40px)
        .like-wrap
          width-height-same(70px)
          .praise-wrap
            width-height-same(70px)
  .popup-bottom
    height auto
</style>
