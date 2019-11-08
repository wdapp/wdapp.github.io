<template>
  <div class="list-wrapper">
    <div class="list-group">
      <li class="list-item" v-for="(option, key) of options" :key="key">
        <van-card :title="option.title" :thumb="option.thumb">
          <div slot="tags">
            <van-tag
              plain
              type="danger"
              round
              color="#FF454B"
              text-color="#FF454B"
              size="large"
              v-for="(tag, key) of option.tags"
              :key="key"
            >
              {{ tag }}
            </van-tag>
          </div>
        </van-card>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  name: "List",
  props: {
    options: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'

.list-wrapper
  overflow auto
  max-height 820px
  .list-group
    .list-item
      list-style none
      padding 40px 30px
      box-sizing border-box
      border-bottom 1px solid $ddd
      height 204px
      .van-card
        padding 0
        background-color $fff
        .van-card__header
          .van-card__thumb
            width 220px
            height 124px
            margin-right 30px
          .van-card__content
            .van-card__title
              baseTextStyle(32px, $c333, $boldFontWeight)
              overflow visible
              line-height 32px
              margin-bottom 15px
            .van-tag
              margin-right 20px
</style>
