import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import LiveBrowser from '@/pages/live/browser/LiveBrowser'
import LiveMobile from '@/pages/live/mobile/LiveMobile'
import ReplayBrowser from '@/pages/replay/browser/ReplayBrowser'
import ReplayMobile from '@/pages/replay/mobile/ReplayMobile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/liveBrowser/:options',
      name: 'LiveBrowser',
      component: LiveBrowser
    },
    {
      path: '/liveMobile/:options',
      name: 'LiveMobile',
      component: LiveMobile
    },
    {
      path: '/replayBrowser/:options',
      name: 'ReplayBrowser',
      component: ReplayBrowser
    },
    {
      path: '/replayMobile/:options',
      name: 'ReplayMobile',
      component: ReplayMobile
    }
  ]
})
