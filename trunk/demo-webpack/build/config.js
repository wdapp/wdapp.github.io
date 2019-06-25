module.exports = {
  debug: true,
  port: '8080',
  version: '1.0.0',
  timestamp: (new Date()),
  tag: '1.0.0',
  host: 'localhost',
  path: 'localhost:8080',
  admin: {
    live: {
      userid: '',
      roomid: '',
      viewername: '',
      viewertoken: '',
      fastMode: ''
    },
    liveMobile: {
      userid: '',
      roomid: '',
      viewername: '',
      viewertoken: '',
    },
    replay: {
      userid: '',
      roomid: '',
      recordid: '',
      viewername: '',
      viewertoken: '',
      isH5play: '',
      fastMode: ''
    },
    replayMobile: {
      userid: '',
      roomid: '',
      recordid: '',
      viewername: '',
      viewertoken: '',
    }
  }
}
