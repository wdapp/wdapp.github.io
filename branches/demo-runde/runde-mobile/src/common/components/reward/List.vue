<template>
  <div class="list-wrapper">
    <ul class="money-group">
      <li
        class="item"
        :class="{ active: active === key }"
        v-for="(option, key) of options"
        :key="key"
        @click="handleMoneyClick(key, option.money)"
      >
        {{ "￥" + option.money }}
      </li>
    </ul>
    <div class="money-input-wrap">
      <p class="money-title">土豪请随意</p>
      <van-field
        class="money-input"
        type="number"
        v-model="value"
        placeholder="请输入随意金额"
        maxlength="3"
      />
    </div>
    <div class="list-footer">
      <p class="select-money">￥{{ money ? money : 0 }}</p>
      <div class="send-money" @click="handleRewardClick">塞进红包</div>
    </div>
  </div>
</template>

<script>
import HuodeScene from "common/websdk/live";
import Mixins from "common/mixins";

export default {
  name: "List",
  mixins: [Mixins],
  props: {
    options: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      active: 0,
      value: "",
      money: 0,
      icon:
        "https://github.wdapp.top/branches/demo-runde/runde-web/src/assets/images/gifts/gift2.png"
    };
  },
  watch: {
    value(newVal) {
      this.money = newVal;
    }
  },
  methods: {
    handleMoneyClick(key, money) {
      this.active = key;
      this.money = money;
    },
    handleRewardClick() {
      if (!this.money || this.money <= 0) {
        return;
      }
      const msg = "打赏给老师[cem_" + this.icon + "]￥" + this.money;
      //发送打赏信息
      this.hd.sendPublicChatMsg(msg);
      //关闭弹窗
      this.emit("closePopup");
      this.emit("closeBottomPopup");
    }
  },
  mounted() {
    this.hd = new HuodeScene();
    this.money = this.options[this.active].money;
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'

.list-wrapper
  width 100%
  background-color $fff
  .money-group
    width 100%
    margin-top 44px
    margin-bottom 14px
    display flex
    flex-wrap wrap
    justify-content space-around
    .item
      margin-bottom 30px
      width 200px
      height 80px
      border 1px solid $ddd
      border-radius 15px
      baseTextStyle(32px)
      line-height 80px
      text-align center
    .active
      border-color $red
      color $red
  .money-input-wrap
    margin-bottom 47px
    padding 0 30px
    box-sizing border-box
    .money-title
      baseTextStyle(26px)
      margin-bottom 16px
    .money-input
      font-size 32px
      line-height 80px
      padding 0 48px
      box-sizing border-box
      width 689px
      height 80px
      border 1px solid $ddd
      border-radius 15px
      outline none

  .list-footer
    height 100px
    width 100%
    padding-left 41px
    padding-right 20px
    box-sizing border-box
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    border-top 1px $ddd solid
    .select-money
      baseTextStyle(40px, $red, $boldFontWeight)
    .send-money
      width 206px
      height 60px
      background $red
      border-radius 30px
      baseTextStyle(32px, $fff)
      line-height 60px
      text-align center
</style>
