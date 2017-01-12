// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './components/app'
import VueRouter from 'vue-router'
var configroutes = require('./assets/routes.json')

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: configroutes.home,
      component: App,
      name: configroutes.home },
    { path: configroutes.usecases.home,
      component: App,
      name: configroutes.usecases.home }
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data () {
    return {
    }
  }
})
