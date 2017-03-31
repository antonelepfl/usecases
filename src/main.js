// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import App from 'components/app.vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)
Vue.use(VueMaterial)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/:list_usecases', // display the UC bases on the key of usecases.json
      component: App,
      props: true // to see in the component as props
    },
    // ============================ trace analysis ============================
    { path: '/traceanalysis/:uc_name',
      component: function (resolve) {
        require(['components/traceanalysis/ta-form.vue'], resolve)
      },
      props: true,
      name: 'ta_form'
    },
    // ============================ circuit building ============================
    { path: '/circuitbuilding/:uc_name',
      component: function (resolve) {
        require(['components/circuitbuilding/model-container.vue'], resolve)
      },
      props: true,
      name: 'cb_models'
    },
    { path: '/circuitbuilding/:uc_name/:model_name',
      component: function (resolve) {
        require(['components/circuitbuilding/cb-form.vue'], resolve)
      },
      props: true,
      name: 'cb_form'
    },
    // ============================ singlecellmodeling ============================
    { path: '/singlecellmodeling/:uc_name',
      component: function (resolve) {
        require(['components/traceanalysis/ta-form.vue'], resolve)
      },
      props: true,
      name: 'sc_form'
    },
    { path: '/singlecellmodeling/:uc_name',
      component: function (resolve) {
        require(['components/singlecellmodeling/model-container.vue'], resolve)
      },
      props: true,
      name: 'sc_models'
    },
    { path: '/singlecellmodeling/:uc_name/:folder_name',
      component: function (resolve) {
        require(['components/singlecellmodeling/model-form.vue'], resolve)
      },
      props: true,
      name: 'sc_models_form'
    },
    // ============================ moprhology ============================
    { path: '/morphology/:uc_name',
      component: function (resolve) {
        require(['components/morphology/model-container.vue'], resolve)
      },
      props: true,
      name: 'morph_models'
    },
    { path: '/morphology/:uc_name/:folder_name',
      component: function (resolve) {
        require(['components/morphology/form-replacing.vue'], resolve)
      },
      props: true,
      name: 'morph_form_replacing'
    },
    // ============================ mooc ============================
    { path: '/mooc/:uc_name',
      component: function (resolve) {
        require(['components/mooc/mooc-form.vue'], resolve)
      },
      props: true,
      name: 'mooc_form'
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
  router
})
