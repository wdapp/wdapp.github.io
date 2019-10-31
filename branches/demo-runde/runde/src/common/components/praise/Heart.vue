<template>
  <div
    class="heart-wrapper"
    :style="color"
  ></div>
</template>

<script>
export default {
  name: 'Heart',
  computed: {
    color () {
      const colors = ['red', 'pink', 'orange', 'lightsalmon', 'lightblue', 'lightgreen', 'lightyellow', 'lightpink', 'yellow', 'blue']
      const index = parseInt((Math.random() * colors.length))
      const color = colors[index]
      return 'background-color:' + color
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .heart-wrapper
    width-height-same(25px)
    position absolute
    background-color red
    transform rotate(45deg)
  .heart-wrapper:before
    content ''
    background-color inherit
    width-height-same(25px)
    position absolute
    border-radius 50%
    left -12.5px
  .heart-wrapper:after
    content ''
    background-color inherit
    width-height-same(25px)
    position absolute
    border-radius 50%
    top -12.5px
</style>
