import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: { title: 'Home' }
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue')
    // },
    {
      path: '/cards',
      name: 'Cards',
      component: () => import('../views/CardViews.vue'),
      meta: { title: 'Cards' }
    },
    // {
    //   path: '/cards',
    //   name: 'cards',
    //   component: () => import('../views/CardsView.vue')
    // },
    // {
    //   path: '/settings',
    //   name: 'settings',
    //   component: () => import('../views/SettingsView.vue')
    // }
  ]
})

export default router
