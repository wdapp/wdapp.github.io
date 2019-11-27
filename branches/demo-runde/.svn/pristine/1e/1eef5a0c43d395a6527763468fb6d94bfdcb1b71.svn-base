import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('@/pages/Index')
    },
    {
      path: '/live/:options',
      name: 'Live',
      component: () => import('@/pages/live/Live')
    },
    {
      path: '/replay/:options',
      name: 'Replay',
      component: () => import('@/pages/replay/Replay')
    },
    {
      path: '/transfer/:options',
      name: 'Transfer',
      component: () => import('@/common/components/transfer/Transfer')
    }
  ]
})
