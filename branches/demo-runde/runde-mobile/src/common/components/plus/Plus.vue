<template>
  <div class="plus-wrapper">
    <ul class="plus-btn-group">
      <li class="reward-wrap item" @click="handleRewardClick">
        <span class="reward-icon"></span>
        <p class="reward-text text">打赏</p>
      </li>
      <li class="evaluation-wrap item">
        <span class="evaluation-icon"></span>
        <p class="evaluation-text text">评价</p>
      </li>
      <li class="advisory-wrap item">
        <span class="advisory-icon"></span>
        <p class="advisory-text text">咨询</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Plus",
  methods: {
    emit(event, options) {
      this.bus.$emit(event, options);
    },
    handleRewardClick() {
      const options = {
        component: "CommonReward"
      };
      this.emit("rewardclick", options);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'

.plus-wrapper
  width 100%
  height 193px
  background $F5F1F6
  padding-left 44px
  box-sizing border-box
  .plus-btn-group
    height 100%
    display flex
    flex-direction row
    align-items center
    .item
      margin-right 88px
      .text
        margin-top 13px
        baseTextStyle()
        text-align center
      .reward-icon
        bg-image('plus/reward', 100)
      .evaluation-icon
        bg-image('plus/evaluation', 100)
      .advisory-icon
        bg-image('plus/advisory', 100)
</style>
