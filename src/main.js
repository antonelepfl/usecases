// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './components/app'
import VueRouter from 'vue-router'
// import ModelContainer from './components/model-container.vue'
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
    // { path: configroutes.models,
    //   component: ModelContainer,
    //   name: configroutes.models },
    // { path: configroutes.usecases.models,
    //   component: ModelContainer,
    //   name: configroutes.usecases.models }
  ],
  scrollBehavior (to, from, savedPosition) {
    // to scroll to the top every change of route
    return { x: 0, y: 0 }
  }
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
