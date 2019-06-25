class VideoTip {

  constructor() {

  }

  init(info = 'loading...', id = '') {
    let tempelate = `
    <div class="waiting-layer">
      <p class="waiting-text">${info}</p>
    </div>
    `
    let div = document.createElement('div')
    div.className = 'video-tip'
    div.innerHTML = tempelate
    let callbackPlayer = document.getElementById(id)
    callbackPlayer && callbackPlayer.appendChild(div)
  }
}

export default VideoTip