import Vue from 'vue'
import Router from 'vue-router'


import Home from './views/Home.vue'
import Burn from './views/Burn.vue'
import ClaimToast from './views/ClaimToast.vue'
 
import Dashboard from './views/Dashboard.vue'


import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({  
  mode: 'history',
  base: process.env.PUBLIC_URL,
  routes: [

    {
      path: '/',
      name: 'home',
      component: Home
    } ,

    {
      path: '/burn',
      name: 'burn',
      component: Burn
    } ,
    {
      path: '/claimtoast',
      name: 'claimtoast',
      component: ClaimToast
    } ,



    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    } ,

    

   
    {
      path: '/*',
      component: NotFound
    },
  ]
})
