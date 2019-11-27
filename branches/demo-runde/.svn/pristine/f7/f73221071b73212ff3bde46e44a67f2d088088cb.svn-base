<template>
  <div class="wrapper">
    <div class="title-wrapper">
      <p class="text">{{title}}</p>
    </div>
    <div class="mobile-wrapper">
      <span class="mobile-icon"></span>
      <span class="mobile-text">移动端观看</span>
    </div>
    <div class="online-users">
      <span class="users-icon"></span>
      <span class="users-number">{{number}}</span>
      <span class="users-text">人正在观看</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LivePlayerHeader',
  data () {
    return {
      title: '【中】2019年终极保过班 | 中药学综合知识与技能 | 学习学习学习学习学习学习学习学习学习学习学习学习学习学习学习学习学习学习',
      number: 99999999999999
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"
  @import "~styles/varibles.styl"

  .wrapper
    height 70px
    box-sizing border-box
    padding-left 37px
    padding-right 33px
    .title-wrapper
      color $generalTextColor
      font-size 20px
      font-family Microsoft YaHei
      font-weight bold
      line-height 70px
      max-width 750px
      float left
      .text
        ellipsis()
    .online-users
      margin-right 48px
      height 100%
      width 211px
      float right
      generalText()
      line-height 70px
      .users-icon
        display inline-block
        background-image url("~images/users.png")
        background-size 30px
        width-height-same(30px)
        margin-right 10px
        vertical-align middle
      .users-number
        vertical-align middle
        display inline-block
        max-width 80px
        ellipsis()
      .users-text
        vertical-align middle
    .mobile-wrapper
      float right
      generalText()
      line-height 70px
      .mobile-icon
        margin-right 6px
        display inline-block
        background-size 30px
        width-height-same(30px)
        background-image url("~images/phone.png")
        vertical-align: middle;
      .mobile-text
        vertical-align: middle;
</style>
