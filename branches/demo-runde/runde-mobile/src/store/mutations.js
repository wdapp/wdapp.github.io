export default {
  changeUrl(state, url) {
    state.url = url;
    localStorage.url = url;
  },
  changePlayState(state, status) {
    state.playState = status;
  },
  changeScreenState(state, status) {
    state.screenState = status;
  },
  setViewer(state, viewer) {
    state.viewer = viewer;
  },
  setTemplate(state, template) {
    state.template = template;
  }
};
