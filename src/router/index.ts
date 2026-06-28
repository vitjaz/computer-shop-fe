import { createRouter, createWebHistory } from 'vue-router'

import { ROUTE_NAMES } from '@/constants/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/ui-kit',
      name: ROUTE_NAMES.uiKit,
      component: () => import('@/views/UiKitView.vue'),
    },
  ],
})

export default router
