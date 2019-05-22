import Component from 'common/component'
import template from './thumbnail.html'
import './thumbnail.scss'
import Utils from 'common/utils'

class Thumbnail extends Component {
  index = 0

  constructor() {
    super()
    this.render('thumbnail', template, () => {
      this.init()
    })
  }

  init() {
    hd.onAllPages((pages) => {
      Utils.log(pages)
      for (let page of pages) {
        this.addThumbnail(page.url, page.time)
      }
      this.addEvents()
    })
  }

  addThumbnail(url, time) {
    let template = `
      <li class="thumbnail-list">
        <img class="thumbnail-list-img"
             src="${url}"
             alt="">
        <span class="thumbnail-list-time">${Utils.formatSeconds(time)}</span>
      </li>
    `
    let thumbnailListGroup = this.getNode('thumbnailListGroup')
    this.appendChild(thumbnailListGroup, template)
  }

  addEvents() {
    let self = this
    let thumbnailList = document.getElementsByClassName('thumbnail-list')
    for (var i = 0; i < thumbnailList.length; i++) {
      let thumbnail = thumbnailList[i]
      thumbnail.value = i
      this.bind(thumbnail, 'click', function () {
        self.removeClass(thumbnailList[self.index], 'active')
        self.addClass(this, 'active')
        self.index = this.value
      })
    }
  }
}

export default Thumbnail