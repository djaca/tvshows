import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/views/Home').default
    },
    {
      path: '/browse',
      name: 'browse',
      component: require('@/views/Browse').default
    },
    {
      path: '/show/:id',
      name: 'show',
      component: require('@/views/Show').default
    },
    {
      path: '/show/:id/:season',
      name: 'season',
      component: require('@/views/Season').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
