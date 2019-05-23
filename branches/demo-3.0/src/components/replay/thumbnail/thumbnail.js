import Component from 'common/component'
import template from './thumbnail.html'
import './thumbnail.scss'
import Utils from 'common/utils'
// import Lazyload from 'lazyloadjs'

class Thumbnail extends Component {
  index = 0
  delaySeek = 0
  isPlayerLoad = false
  isScroll = true
  page = {}

  constructor() {
    super()
    this.render('thumbnail', template, () => {
      this.init()
    })
  }

  init() {
    let once = true
    let thumbnailListGroup = this.getNode('thumbnailListGroup')
    let thumbnailScrollWrap = this.getNode('thumbnailScrollWrap')
    let thumbnailList = []
    let thumbnailListTime = []
    
    // console.log(Lazyload)
    
    hd.onAllPages((pages) => {
      Utils.log(pages)
      for (let page of pages) {
        this.addThumbnail(thumbnailListGroup, page.url, page.time, once)
        once && (once = false)
      }
      thumbnailList = this.handleClick()
      thumbnailListTime = [...document.getElementsByClassName('thumbnail-list-time')]
    })
    hd.onChangePageSync((page) => {
      Utils.log('onChangePageSync', page)
      this.page = page
      this.updateThumbnailList(page, thumbnailListTime, thumbnailList, thumbnailScrollWrap)
    })
    hd.once('isPlayerLoad', (isPlayerLoad) => {
      this.isPlayerLoad = isPlayerLoad
    })
    hd.on('showThumbnailList', () => {
      if (!Utils.isEmptyObject(this.page)) {
        Utils.log(`updateThumbnailList fail await page load!`)
        return false
      }
      this.updateThumbnailList(this.page, thumbnailListTime, thumbnailList, thumbnailScrollWrap)
    })
    this.bind(thumbnailScrollWrap, 'mouseleave', () => {
      this.isScroll = true
    })
    this.bind(thumbnailScrollWrap, 'mouseenter', () => {
      this.isScroll = false
    })
  }

  addThumbnail(parent, url, time, once) {
    let template = `
      <li class="thumbnail-list ${once ? 'active' : ''}">
        <img lazy class="thumbnail-list-img"
             src="${url}"
             alt="">
        <span class="thumbnail-list-time" time="${time}">${Utils.formatSeconds(time)}</span>
      </li>
    `
    this.appendChild(parent, template)
  }

  handleClick() {
    let self = this
    let thumbnailList = document.getElementsByClassName('thumbnail-list')

    for (var i = 0; i < thumbnailList.length; i++) {
      let thumbnail = thumbnailList[i]
      this.bind(thumbnail, 'click', function () {
        let time = this.getElementsByTagName('span')[0].getAttribute('time')
        self.onSeek(time)
      })
    }

    return thumbnailList
  }

  updateThumbnailList(page, thumbnailListTime, thumbnailList, thumbnailScrollWrap) {
    thumbnailListTime.forEach((element, index) => {
      if (element.getAttribute('time') == page.time) {
        this.removeClass(thumbnailList[this.index], 'active')
        this.index = index
        this.addClass(thumbnailList[this.index], 'active')
        this.scrollTopThumbnailList(thumbnailScrollWrap, this.index)
      }
    })
  }

  scrollTopThumbnailList(scrollTopWrap, index) {
    if (!this.isScroll) {
      return false
    }
    let scrollHeight = (index * 74) + 5
    scrollTopWrap.scrollTop = scrollHeight
    return true
  }

  onSeek(time) {
    if (!this.checkout('onSeek')) {
      return false
    }
    if (isNaN(time)) {
      return false
    }
    this.delaySeek && clearTimeout(this.delaySeek)
    this.delaySeek = setTimeout(() => {
      hd.seek(time)
    }, 500)
    return true
  }

  checkout(message) {
    if (!this.isPlayerLoad) {
      Utils.log(`${message} fail await player load!`)
      return false
    }
    return true
  }

}

export default Thumbnail