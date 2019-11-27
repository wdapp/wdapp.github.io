import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Live from '@/pages/browser/live/Live'
import Replay from '@/pages/browser/replay/Replay'
import LiveMobile from '@/pages/mobile/Live'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/live/:options',
      name: 'Live',
      component: Live
    },
    {
      path: '/replay/:options',
      name: 'Replay',
      component: Replay
    },
    {
      path: '/liveMobile/:options',
      name: 'LiveMobile',
      component: LiveMobile
    }
  ]
})
