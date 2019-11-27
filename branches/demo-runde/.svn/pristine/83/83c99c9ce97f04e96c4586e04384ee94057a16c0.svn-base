import VueDragResize from 'vue-drag-resize'

export default {
  components: {
    VueDragResize
  },
  data () {
    return {
      drag: {
        isDraggable: true,
        active: true,
        resizable: false,
        width: 290,
        height: 163,
        rectangle: {
          width: 0,
          height: 0,
          top: 0,
          left: 0
        }
      }
    }
  },
  computed: {
    Drag () {
      return this.$refs.Drag
    },
    fontSize () {
      const fontSize = document.getElementsByTagName('html')[0].style.fontSize
      return parseFloat(fontSize)
    },
    dragWidth () {
      let width = this.drag.width
      const size = 192
      width = (width / size) * this.fontSize
      return width
    },
    dragHeight () {
      let height = this.drag.height
      const size = 192
      height = (height / size) * this.fontSize
      return height
    }
  },
  watch: {
    size (newValue) {
      this.reset()
      if (newValue === 'large') {
        this.drag.active = false
        this.drag.isDraggable = false
      } else {
        this.drag.active = true
        this.drag.isDraggable = true
      }
    }
  },
  methods: {
    onClicked (event) {

    },
    onDragGing (rectangle) {
      this.drag.rectangle.width = rectangle.width
      this.drag.rectangle.height = rectangle.height
      this.drag.rectangle.top = rectangle.top
      this.drag.rectangle.left = rectangle.left
    },
    onMouseup () {
      this.intersectsRect({
        rect: this.drag.rectangle,
        enter: () => {
          this.reset()
        }
      })
    },
    intersectsRect (options) {
      const width = this.dragWidth
      const height = this.dragHeight

      const rect = options.rect
      const rectLeft = rect.left
      const rectTop = rect.top

      if (rectLeft <= 0 && rectLeft >= -width && rectTop >= 0 && rectTop <= height) {
        options.enter && options.enter()
      } else {
        options.leave && options.leave()
      }
    },
    reset () {
      this.Drag.$el.style.top = 0
      this.Drag.$el.style.left = 0
    }
  }
}
