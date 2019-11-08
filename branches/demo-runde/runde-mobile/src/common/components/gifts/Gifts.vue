<template>
  <div class="gifts-wrapper">
    <van-tabs v-model="tabOptions.active">
      <van-tab
        :title="tab.title"
        v-for="(tab, key) of tabOptions.tabs"
        :key="key"
        :disabled="disabled(tab.title)"
      >
        <component :is="tab.component" :options="tab.options"></component>
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
      <div class="send-btn-wrap">
        <span class="send-btn-text">发送</span>
      </div>
    </div>
  </div>
</template>

<script>
import GiftsList from "./List";

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
                url: require("images/gifts/flower.png"),
                title: "玫瑰"
              },
              {
                url: require("images/gifts/heart.png"),
                title: "老师心"
              },
              {
                url: require("images/gifts/like.png"),
                title: "666"
              },
              {
                url: require("images/gifts/flower.png"),
                title: "玫瑰"
              },
              {
                url: require("images/gifts/heart.png"),
                title: "老师心"
              },
              {
                url: require("images/gifts/like.png"),
                title: "666"
              },
              {
                url: require("images/gifts/flower.png"),
                title: "彩笔"
              },
              {
                url: require("images/gifts/heart.png"),
                title: "金麦"
              },
              {
                url: require("images/gifts/like.png"),
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
      active: 0
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
    }
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
