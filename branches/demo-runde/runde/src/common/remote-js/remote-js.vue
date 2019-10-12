<template>
  <render-remote-javascript ref="remote" :src="this.src"></render-remote-javascript>
</template>
<script>
export default {
  name: 'remote-js',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  components: {
    'render-remote-javascript': {
      render (createElement) {
        return createElement('script', {
          attrs: {
            type: 'text/javascript',
            src: this.src
          }
        })
      },
      props: {
        src: {
          type: String,
          required: true
        }
      }
    }
  },
  mounted () {
    this.$refs.remote.$el.onload = () => {
      this.$emit('onremoted')
    }
  }
}
</script>
