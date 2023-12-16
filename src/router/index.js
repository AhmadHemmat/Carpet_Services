import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import { loginStore } from '@/stores/index'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/authentication/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/authentication/Login.vue')
    },
    {
      path: '/human-resource',
      name: 'human-resource',
      component: () => import('../views/HumanResources.vue'),
      meta: { requiresAuth: true }

    },
  ]
})

router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const store = loginStore()

  if (to.meta.requiresAuth && !store.isAuthenticated) {
    return '/login'
  } else if (!to.meta.requiresAuth && to.name === 'login' && store.isAuthenticated) {
    return '/'
  } 


})

export default router
