import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Landing from '@/views/Landing.vue'
import Playground from '@/playground/Playground.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/playground',
    name: 'Playground',
    component: Playground
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 