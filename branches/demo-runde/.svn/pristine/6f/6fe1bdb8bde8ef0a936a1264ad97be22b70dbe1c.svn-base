import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Live from '@/pages/live/Live'
import Replay from '@/pages/replay/Replay'
import Transfer from '@/common/components/transfer/Transfer'

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
      path: '/transfer/:options',
      name: 'Transfer',
      component: Transfer
    }
  ]
})
