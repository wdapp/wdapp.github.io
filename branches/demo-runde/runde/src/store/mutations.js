export default {
  changeUrl (state, url) {
    state.url = url
    try {
      localStorage.url = url
    } catch (e) {
    }
  },
  setViewer (state, viewer) {
    state.viewer = viewer
  },
  setOptions (state, options) {
    state.options = options
  }
}
