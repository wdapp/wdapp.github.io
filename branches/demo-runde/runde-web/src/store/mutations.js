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
  setTemplate (state, template) {
    state.template = template
  },
  setOptions (state, options) {
    state.options = options
  },
  changePlayerStatus (state, status) {
    state.playerStatus = status
  }
}
