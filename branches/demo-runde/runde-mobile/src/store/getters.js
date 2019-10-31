export default {
  getOptions (state) {
    let options = {}
    const url = state.url
    options = parseUrl(url)
    return options
  }
}

function parseUrl (url = '') {
  if (!url && typeof url !== 'string') {
    return false
  }

  const querys = url.split('?')
  if (!querys[1]) {
    return false
  }
  const query = url.split('?')[1]
  const queryArray = query.split('&')
  if (queryArray.length === 0) {
    return false
  }
  const params = {}
  queryArray.forEach(function (item) {
    const key = item.split('=')[0]
    const value = item.split('=')[1]
    params[key] = value
  })

  if (typeof params.isH5play !== 'undefined') {
    if (params.isH5play === 'false') {
      params.isH5play = false
    }
    if (params.isH5play === 'true') {
      params.isH5play = true
    }
  }

  if (typeof params.fastMode !== 'undefined') {
    if (params.fastMode === 'false') {
      params.fastMode = false
    }
    if (params.fastMode === 'true') {
      params.fastMode = true
    }
  }

  return params
}
