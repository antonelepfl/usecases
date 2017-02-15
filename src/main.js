// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
var hbpHello = require('./assets/hbp.hello.js').hellojs
// var authenticated = false
// var configroutes = require('./assets/routes.json')

Vue.use(VueMaterial)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/:list_usecases', // /:usecases
      component: function (resolve) {
        require(['./components/app.vue'], resolve)
      }
    },
    { path: '/:list_usecases/models', // /:usecases/models
      component: function (resolve) {
        require(['./components/model-container.vue'], resolve)
      }
    },
    { path: '/:list_usecases/form/:uc_name', // /:usecases/form
      component: function (resolve) {
        require(['./components/collab-form.vue'], resolve)
      },
      name: 'single_usecase',
      meta: { requiresAuth: true }
    }
  ],
  base: '/usecases/',
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
