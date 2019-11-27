<template>
  <ul class="button-group-wrapper">
    <li class="item share-btn-wrap">
      <span class="share-btn-icon"></span>
    </li>
    <li class="item switch-btn-wrap" @click="handlSwitchClick">
      <span
        class="switch-btn-icon"
        :class="{ 'switch-active': !isSubShow }"
        v-show="hideSwitchBtn"
      ></span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "ButtonGroup",
  props: {
    isSubShow: {
      type: Boolean,
      default: true
    },
    hideSwitchBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      toggle: true
    };
  },
  methods: {
    handlSwitchClick() {
      const show = this.isSubShow;
      if (show) {
        this.switchWindows();
      } else {
        this.openSubWindows();
      }
    },
    switchWindows() {
      this.toggle = !this.toggle;
      this.$emit("switch", this.toggle);
    },
    openSubWindows() {
      this.$emit("open");
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.button-group-wrapper
  .item
    margin-bottom 20px
    .share-btn-icon
      bg-image('share')
    .switch-btn-icon
      bg-image('switch')
    .switch-active
      /*active-image('open-windows')*/
      display inline-block
      width-height-same(70)
      background-image none
      border-radius 35px
      background-color rgba(0, 0, 0, 0.62)
      text-align center
    .switch-active:after
      content '双屏'
      baseTextStyle(18px,$fff)
      line-height 70px
  .item:last-child
    margin-bottom 0
</style>
