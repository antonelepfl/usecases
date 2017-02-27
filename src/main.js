// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import App from './components/app.vue'
import VueResource from 'vue-resource'
import CollabAuthentication from './mixins/collabAuthentication.js'

Vue.use(VueResource)
Vue.use(VueMaterial)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [

    { path: '/:list_usecases',
      component: App,
      props: true // to see in the component as props
    },
    { path: '/:list_usecases/models/:model_name', // (everyusecaselist)/models
      component: function (resolve) {
        require(['./components/model-container.vue'], resolve)
      }
    },
    { path: '/:list_usecases/form/:uc_name', // (everyusecaselist)/form/
      component: function (resolve) {
        require(['./components/collab-form.vue'], resolve)
      },
      props: true
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
  mixins: [CollabAuthentication],
  data () {
    return {
    }
  },
  created () {
    if (!Vue.http.headers.common['Authorization']) {
      this.login() // from CollabAuthentication
    }
  }
})
