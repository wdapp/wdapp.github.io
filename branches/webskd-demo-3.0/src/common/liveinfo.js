import Utils from './utils'

class LiveInfo {
  static loginInfo = {}

  constructor() {

  }

  static parseLoginInfo(d) {
    if (!d) return {}
    return d[0]
  }

  static getLoginInfoData(type, key) {
    if (!LiveInfo.loginInfo || LiveInfo.loginInfo == {}) return
    switch (type) {
      case 'live':
        return LiveInfo.loginInfo['live'][key]
        break
      case 'template':
        return LiveInfo.loginInfo['template'][key]
        break
      case 'viewer':
        return LiveInfo.loginInfo['viewer'][key]
        break
    }
    return ''
  }

  static parseQuestionInfo(d, uid = '') {
    if (!d) return {}
    let data = Utils.stringToJSON(d)
    if (data.action && data.action === 'question') {
      if (data.value) {

        let obj = {
          id: data.value.id,
          questionId: data.value.id,
          isPublish: data.value.isPublish,
          questionContent: data.value.content,
          triggerTime: data.value.triggerTime,
          userId: data.value.userId,
          questionName: data.value.userName,
          self: (data.value.userId === uid)
        }
        return obj
      }
    }
    return {}
  }

  static parseAnswerInfo(d, uid = '') {
    if (!d) return {}
    let data = Utils.stringToJSON(d)
    if (data.action && data.action === 'answer') {
      if (data.value) {
        let obj = {
          answerName: data.value.userName,
          answerContent: data.value.content,
          questionId: data.value.questionId,
          isPrivate: data.value.isPrivate,
          questionUserId: data.value.questionUserId,
          triggerTime: data.value.triggerTime,
          userId: data.value.userId,
          self: (data.value.questionUserId === uid)

        }
        return obj
      }
    }
    return {}
  }

//  解析发布问答的数据
  static parseQAPublishInfo(d) {
    if (!d) return {}
    let data = d
    let publishs = []
    for (let i = 0; i < data.length; i++) {
      let obj = data[i]
      if (obj.action && obj.action === 'publish_question') {
        if (obj.value) {
          let obj1 = {
            questionId: obj.value.questionId
          }
          publishs.push(obj1)
        }
      }
    }
    return publishs
  }

}

export default LiveInfo