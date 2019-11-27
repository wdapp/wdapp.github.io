export default {
  url: getDefaultUrl(),
  viewer: {},
  template: {},
  options: {},
  playerStatus: false,
  lists: getLists()
}

function getDefaultUrl () {
  let defaultUrl = ''

  try {
    defaultUrl = localStorage.url
  } catch (e) {
  }

  return defaultUrl
}

function getLists () {
  const lists = [
    {
      title: '获得场景视频测试直播间',
      subhead: '8月15日  15:00 - 16:00 CC詹姆斯',
      tip: '直播中',
      status: true,
      name: 'Live',
      url: 'https://view.csslcloud.net/api/view/index?roomid=D4A2E14A89D372399C33DC5901307461&userid=2876043E67CBDC9D'
    },
    {
      title: 'CC视频测试回放（第1期）',
      subhead: '8月14日  15:00 - 16:00 王波波',
      tip: '已结束',
      status: false,
      name: 'Replay',
      url: 'https://view.csslcloud.net/api/view/callback?roomid=3115C441D8B66A719C33DC5901307461&userid=B27039502337407C&liveid=9FBB8D3402787184&recordid=96C0454B9E3CE464&name=123456789'
    }, {
      title: '中药一闭关刷题直播（第1期）',
      subhead: '8月15日  15:00 - 16:00 王波波',
      tip: '直播中',
      status: true,
      name: 'Live',
      url: 'https://view.csslcloud.net/api/view/index?roomid=20E2BEC88BEF3EEB9C33DC5901307461&userid=B693062ABB8020E0&name=hello wrold'
    }, {
      title: '获得场景视频测试回放（第2期）',
      subhead: '8月16日  15:00 - 16:00 王波波',
      tip: '已结束',
      status: false,
      name: 'Replay',
      url: 'http://view.csslcloud.net/api/view/callback?roomid=8435F7E261F04EB69C33DC5901307461&userid=920022FE264A70C1&liveid=CBDA6492291E5AD0&recordid=D606FBAFE0000829&name=密码拼接到观看连接中即可'
    }, {
      title: '中药一闭关刷题直播（第23432423432432423423432432期）',
      subhead: '8月17日  15:00 - 16:00 王波波',
      tip: '直播中',
      status: true,
      name: 'Live',
      url: 'https://view.csslcloud.net/api/view/index?roomid=EE66140EDA3F25CC9C33DC5901307461&userid=B693062ABB8020E0&name=第四个直播间'
    }
  ]
  return lists
}
