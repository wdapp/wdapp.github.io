import Utils from './utils'

class LiveInfo {
  static loginInfo = {}

  static lines = null

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

  static parseQuestionInfo(d) {
    if (!d) return {}
    let data = Utils.stringToJSON(d)
    if (data.action && data.action === 'question') {
      if (data.value) {
        let viewerName = LiveInfo.getLoginInfoData('viewer', 'name')
        let obj = {
          id: data.value.id,
          questionId: data.value.id,
          isPublish: data.value.isPublish,
          questionContent: data.value.content,
          triggerTime: data.value.triggerTime,
          userId: data.value.userId,
          questionName: data.value.userName,
          self: (data.value.userName === viewerName)
        }
        return obj
      }
    }
    return {}
  }

  static parseAnswerInfo(d) {
    if (!d) return {}
    let data = Utils.stringToJSON(d)
    if (data.action && data.action === 'answer') {
      if (data.value) {
        let viewerId = LiveInfo.getLoginInfoData('viewer', 'id')

        let obj = {
          answerName: data.value.userName,
          answerContent: data.value.content,
          questionId: data.value.questionId,
          isPrivate: data.value.isPrivate,
          questionUserId: data.value.questionUserId,
          triggerTime: data.value.triggerTime,
          userId: data.value.userId,
          self: (data.value.questionUserId === viewerId)


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

  //解析公共聊天数据
  static parsePublicChatMsg(d) {
    if (!d) return {}
    let data = Utils.stringToJSON(d)
    let viewerId = LiveInfo.getLoginInfoData('viewer', 'id')
    let obj = {
      userId: data.userid,
      userName: data.username,
      userRole: data.userrole,//是否是学生
      groupId: data.groupId,
      msg: data.msg,
      time: data.time,
      chatId: data.chatId,
      status: data.status,
      self: (data.userid === viewerId)
    }
    return obj
  }

  static parsePrivateChatMsg(d, l = false) {
    if (!d) return {}
    let data = Utils.stringToJSON(d)
    let viewerId = LiveInfo.getLoginInfoData('viewer', 'id')
    let obj = {
      fromUserId: data.fromuserid,
      fromUserName: data.fromusername,
      fromUserRole: data.fromuserrole,
      msg: data.msg,
      time: data.time,
      toUserId: data.touserid,
      toUserName: data.tousername,
      fSelf: (data.fromuserid === viewerId),
      tSelf: (data.touserid === viewerId),
      left: l
    }
    return obj
  }

  static parseOnLineTeachers(d) {
    if (!d) return {}
    let dd = d[0]
    let data = dd.teachers
    let teachers = []
    for (let i = 0; i < data.length; i++) {
      var obj = {
        id: data[i].id,
        name: data[i].name,
        ip: data[i].ip,
        role: data[i].role
      }
      teachers.push(obj)
    }
    return teachers
  }

  static parseAnnounceInfo(d) {
    if (!d) return {}
    let dd = d[0]
    return dd
  }


}

export default LiveInfo