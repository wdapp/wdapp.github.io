// flash视频文档 H5视频文档 全屏 第一版暂时不加，后续更新
class FullScreen {
  constructor(options) {
    this.documentMode = options.documentMode
    this.playerMode = options.playerMode
    this.document = document.getElementById(options.id)
    this.player = document.getElementById(options.id)
  }

  documentFullScreen() {
    if (this.documentMode) {
      this.iframeDocumentFullScreen()
    } else {
      this.flashDocumentFullScreen()
    }
  }

  iframeDocumentFullScreen() {

  }

  flashDocumentFullScreen() {

  }

  playerFullScreeen() {
    if (this.playerMode) {
      this.videoPlayerFullScreen()
    } else {
      this.flashPlayerFullScreen()
    }
  }

  videoPlayerFullScreen() {

  }

  flashPlayerFullScreen() {

  }

}