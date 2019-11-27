<template>
  <van-field
    ref="field"
    v-model="value"
    :maxlength="maxlength"
    :placeholder="placeholder"
    @focus="onFocus($event)"
    @blur="onBlur($event)"
    class="message-wrapper"
  />
</template>

<script>
export default {
  name: "Input",
  props: {
    message: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      value: "",
      maxlength: 300,
      placeholder: "在这里和老师互动哦"
    };
  },
  computed: {
    field() {
      return this.$refs.field;
    }
  },
  watch: {
    message(newValue) {
      this.value = newValue;
    },
    value(newValue) {
      this.$emit("change", newValue);
    }
  },
  methods: {
    onFocus(event) {
      this.$emit("focus", event);
    },
    onBlur(event) {
      this.$emit("blur", event);
    },
    focus() {
      this.field.focus();
    },
    blur() {
      this.field.blur();
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'

.message-wrapper
  font-size 28px
  height 68px
  line-height 40px
  background-color $fff
  border 2px solid $ddd
  border-radius 35px
  padding-left 20px
  padding-right 20px
  box-sizing border-box
  outline none
</style>
