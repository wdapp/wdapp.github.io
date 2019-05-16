//模型层（Model），获取数据，监听数据
class Model {

  constructor() {
    this._addres = ''

  }

  set address(url) {
    if (typeof url !== 'string') {
      return false
    }
    this._addres = url
    this.setLocalStorage(url)
    return true
  }

  setLocalStorage(url) {
    localStorage.address = url
  }

  get address() {
    return this._addres
  }


}

export default Model