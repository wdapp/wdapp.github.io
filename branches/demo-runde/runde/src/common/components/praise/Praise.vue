<template>
  <div class="praise-wrapper">
    <div class="praise-btn-wrap">
      <span class="praise-btn-icon"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HDPraise'
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .praise-wrapper
    .praise-btn-wrap
      width-height-same(40px)
      .praise-btn-icon
        position absolute
        width-height-full()
        background url('~images/praise.png') no-repeat
        background-size 40px
</style>
