import VueDragResize from 'vue-drag-resize'

export default {
  components: {
    VueDragResize
  },
  data () {
    return {
      drag: {
        isDraggable: false,
        active: true,
        resizable: false,
        rectangle: {
          width: 0,
          height: 0,
          top: 0,
          left: 0
        }
      }
    }
  },
  watch: {
    size (newValue) {
      // console.log(newValue)
      // if (newValue === 'large') {
      //   this.drag.active = false
      //   this.drag.isDraggable = false
      //   this.drag.resizable = false
      // } else {
      //   this.drag.active = true
      //   this.drag.isDraggable = true
      //   this.drag.resizable = true
      // }
    }
  },
  methods: {
    onClicked (event) {
      // const target = event.target
      // if (target.className === 'close-icon') {
      //   this.status = false
      // }
    },
    onDragGing (rectangle) {
      // this.drag.rectangle.width = rectangle.width
      // this.drag.rectangle.height = rectangle.height
      // this.drag.rectangle.top = rectangle.top
      // this.drag.rectangle.left = rectangle.left
      // this.intersectsRect({
      //   rect: this.drag.rectangle,
      //   enter: () => {
      //     this.enter()
      //   },
      //   leave: () => {
      //     this.leave()
      //   }
      // })
    },
    onMouseup () {
      // this.intersectsRect({
      //   rect: this.drag.rectangle,
      //   enter: () => {
      //     this.reset()
      //   }
      // })
    },
    intersectsRect (options) {
      // const rect = options.rect
      // const height = rect.height
      // const rectTop = rect.top
      // if (rectTop >= 0 && rectTop <= height) {
      //   options.enter && options.enter()
      // } else {
      //   options.leave && options.leave()
      // }
    },
    reset () {
      // this.Drag.$el.style.top = 0
      // this.Drag.$el.style.left = 0
    }
  }
}
