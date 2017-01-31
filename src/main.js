// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

var configroutes = require('./assets/routes.json')

Vue.use(VueMaterial)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: configroutes.single_usecases,
      component: function (resolve) {
        require(['./components/app.vue'], resolve)
      },
      params: {'single': 1}
    },
    { path: configroutes.usecases, // /:usecases/
      component: function (resolve) {
        require(['./components/app.vue'], resolve)
      }
    },
    { path: configroutes.models.path, // /:usecases/models
      component: function (resolve) {
        require(['./components/model-container.vue'], resolve)
      }
    },
    { path: configroutes.collab_form.path, // /:usecases/form
      component: function (resolve) {
        require(['./components/collab-form.vue'], resolve)
      }
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
  // watch: {
  //   '$route' (to, from) {
  //     console.log(to) // react to route changes...
  //   }
  // },
  data () {
    return {
    }
  }
})
