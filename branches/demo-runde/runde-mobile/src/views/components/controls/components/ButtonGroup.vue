<template>
  <ul class="button-group-wrapper">
    <li class="item share-btn-wrap">
      <span class="share-btn-icon"></span>
    </li>
    <li class="item switch-btn-wrap">
      <span class="switch-btn-icon"></span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "ButtonGroup"
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
  .item:last-child
    margin-bottom 0
</style>
