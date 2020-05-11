import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'mask_map',
      // component: mask
      component: () => import('./views/mask.vue')
    }
  ]
})
