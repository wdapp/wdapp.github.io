<template>
  <div class="gifts-wrapper">
    <van-tabs v-model="tabOptions.active">
      <van-tab
        :title="tab.title"
        v-for="(tab, key) of tabOptions.tabs"
        :key="key"
        :disabled="disabled(tab.title)"
      >
        <component
          @gift="onGift"
          :is="tab.component"
          :options="tab.options"
        ></component>
      </van-tab>
    </van-tabs>
    <div class="gifts-footer">
      <ul class="btn-group">
        <li
          class="item"
          :class="{ active: active === key }"
          v-for="(number, key) of this.giftNumbers"
          :key="key"
          @click="onNumberClick(key)"
        >
          <span class="number">{{ "x" + number }}</span>
        </li>
      </ul>
      <div class="send-btn-wrap" @click="sendGift">
        <span class="send-btn-text">发送</span>
      </div>
    </div>
  </div>
</template>

<script>
import GiftsList from "./List";
import HuodeScene from "common/websdk/live";

export default {
  name: "Gifts",
  components: {
    GiftsList
  },
  data() {
    return {
      tabOptions: {
        active: 0,
        tabs: [
          {
            title: "送礼物",
            component: "GiftsList",
            options: [
              {
                url:
                  "https://github.wdapp.top/branches/demo-runde/runde-web/src/assets/images/gifts/gift1.png",
                title: "玫瑰"
              },
              {
                url:
                  "https://github.wdapp.top/branches/demo-runde/runde-web/src/assets/images/gifts/gift2.png",
                title: "老师心"
              },
              {
                url:
                  "https://github.wdapp.top/branches/demo-runde/runde-web/src/assets/images/gifts/gift3.png",
                title: "666"
              },
              {
                url:
                  "https://github.wdapp.top/branches/demo-runde/runde-web/src/assets/images/gifts/gift1.png",
                title: "玫瑰"
              },
              {
                url:
                  "https://github.wdapp.top/branches/demo-runde/runde-web/src/assets/images/gifts/gift2.png",
                title: "老师心"
              },
              {
                url:
                  "https://github.wdapp.top/branches/demo-runde/runde-web/src/assets/images/gifts/gift3.png",
                title: "666"
              },
              {
                url:
                  "https://github.wdapp.top/branches/demo-runde/runde-web/src/assets/images/gifts/gift1.png",
                title: "彩笔"
              },
              {
                url:
                  "https://github.wdapp.top/branches/demo-runde/runde-web/src/assets/images/gifts/gift2.png",
                title: "金麦"
              },
              {
                url:
                  "https://github.wdapp.top/branches/demo-runde/runde-web/src/assets/images/gifts/gift3.png",
                title: "流星雨"
              }
            ]
          },
          {
            title: "",
            component: ""
          },
          {
            title: "",
            component: ""
          },
          {
            title: "",
            component: ""
          }
        ]
      },
      giftNumbers: [1, 5, 10],
      active: 0,
      activeNumber: 1,
      gift: {}
    };
  },
  methods: {
    disabled(title) {
      let disabled = false;
      if (!title) {
        disabled = true;
      }
      return disabled;
    },
    onNumberClick(key) {
      this.active = key;
      this.activeNumber = this.giftNumbers[this.active];
    },
    onGift(gift) {
      this.gift = gift;
    },
    sendGift() {
      const msg = "赠送给老师[cem_" + this.gift.url + "]x" + this.activeNumber;
      //发送礼物消息
      this.hd.sendPublicChatMsg(msg);
      //关闭弹窗
      this.bus.$emit("closePopup");
    }
  },
  mounted() {
    this.hd = new HuodeScene();
    this.gift = this.tabOptions.tabs[this.active].options[
      this.tabOptions.active
    ];
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'

.gifts-wrapper
  background-color $fff
  >>> .van-tabs
    .van-tabs__wrap
      height 80px
      .van-tabs__nav
        height 100%
        .van-tab
          height 100%
          line-height 80px
          .van-ellipsis
            baseTextStyle(32px, $c333, $boldFontWeight)
  .gifts-footer
    height 100px
    width 100%
    border 1px $ddd solid
    padding-left 30px
    padding-right 20px
    box-sizing border-box
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    .btn-group
      .item
        width 130px
        height 60px
        border 1px solid $ddd
        border-radius 30px
        line-height 60px
        text-align center
        margin-right 20px
        float left
        baseTextStyle(32px)
      .active
        border-color $red
        color $red
    .send-btn-wrap
      width 180px
      height 60px
      background $red
      border-radius 30px
      line-height 60px
      text-align center
      .send-btn-text
        baseTextStyle(32px, $fff)
</style>
