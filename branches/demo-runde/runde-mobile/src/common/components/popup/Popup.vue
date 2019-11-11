<template>
  <van-popup
    v-model="isShow"
    closeable
    close-icon="close"
    position="bottom"
    :style="style"
    @closed="onClosed"
  >
    <slot></slot>
  </van-popup>
</template>

<script>
export default {
  name: "Popup",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  computed: {
    style() {
      return {
        height: "auto"
      };
    }
  },
  watch: {
    show() {
      this.isShow = this.show;
    }
  },
  methods: {
    onClosed() {
      this.$emit("closed");
    }
  }
};
</script>

<style lang="stylus" scoped>
.van-popup
  >>> .van-icon
    font-size 40px
</style>
