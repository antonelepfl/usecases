// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import App from 'components/app.vue'
import CollabAuthentication from 'mixins/collabAuthentication'
import axios from 'axios'

Vue.use(VueMaterial)
Vue.use(VueRouter)

Vue.prototype.$http = axios

const router = new VueRouter({
  routes: [
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
    { path: '/singlecellmodeling/form/:uc_name',
      component: function (resolve) {
        require(['components/traceanalysis/ta-form.vue'], resolve)
      },
      props: true,
      name: 'sc_form'
    },
    { path: '/singlecellmodeling/optimizeastriatalfast-spikinginterneuron',
      component: function (resolve) {
        require(['components/singlecellmodeling/striatal/striatal-container.vue'], resolve)
      },
      name: 'sc_striatal_models'
    },
    { path: '/singlecellmodeling/optimizeastriatalfast-spikinginterneuron/:folder_name',
      component: function (resolve) {
        require(['components/singlecellmodeling/striatal/form-replacing.vue'], resolve)
      },
      props: true,
      name: 'sc_striatal_form_replacing'
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
        require(['components/morphology/analysis-model-container.vue'], resolve)
      },
      props: true,
      name: 'morph_analysis_models'
    },
    { path: '/morphology/:uc_name/view',
      component: function (resolve) {
        require(['components/morphology/viewer-model-container.vue'], resolve)
      },
      props: true,
      name: 'morph_viewer_models'
    },
    { path: '/morphology/:uc_name/:folder_name',
      component: function (resolve) {
        require(['components/morphology/form-replacing.vue'], resolve)
      },
      props: true,
      name: 'morph_form_replacing'
    },
    // ================= singlecellinsilicoexperiments ================
    { path: '/singlecellinsilicoexperiments/:uc_name',
      component: function (resolve) {
        require(['components/singlecellinsilicoexperiments/model-container.vue'], resolve)
      },
      props: true,
      name: 'insilico_exp'
    },
    // ================= brainareacircuitinsilicoexperiments ================
    { path: '/brainareacircuitinsilicoexperiments/:uc_name',
      component: function (resolve) {
        require(['components/brainareacircuitinsilicoexperiments/model-container.vue'], resolve)
      },
      props: true,
      name: 'brainarea_circuits'
    },
    { path: '/brainareacircuitinsilicoexperiments/:uc_name/:model_name',
      component: function (resolve) {
        require(['components/circuitbuilding/cb-form.vue'], resolve)
      },
      props: true,
      name: 'brainarea_form'
    },
    // ============================ mooc ============================
    { path: '/mooc/',
      component: function (resolve) {
        require(['components/mooc/course-container.vue'], resolve)
      },
      props: true,
      name: 'mooc_container'
    },
    { path: '/mooc/:uc_name/:week',
      component: function (resolve) {
        require(['components/mooc/mooc-form.vue'], resolve)
      },
      props: true,
      name: 'mooc_form'
    },
    { path: '/mooc/:uc_name/',
      component: function (resolve) {
        require(['components/mooc/weeks-container.vue'], resolve)
      },
      props: true,
      name: 'weeks_container'
    },
    // ================= terms and conditions ================
    { path: '/termsandconditions/:list_usecases/:uc_name',
      component: function (resolve) {
        require(['components/terms-and-conditions.vue'], resolve)
      },
      props: true,
      name: 'termsandconditions'
    },
    // ================= entity dashboard integration ================
    { path: '/entitydashboard/',
      component: function (resolve) {
        require(['components/entitydashboard/form-replacing.vue'], resolve)
      },
      props: true,
      name: 'entitydashboard'
    },
        // ================= login ================
    { path: '/login/',
      component: function (resolve) {
        require(['components/login.vue'], resolve)
      },
      name: 'login'
    },
    // ============================ rest of UC ============================
    { path: '/:list_usecases', // display the UC bases on the key of usecases.json
      component: App,
      props: true // to see in the component as props
    },
    { path: '/:list_usecases/:uc_name',
      component: function (resolve) {
        require(['components/traceanalysis/ta-form.vue'], resolve)
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

// check the authentication for each page
router.beforeEach((to, from, next) => {
  let loginPath = '/login'
  if (to.path === loginPath) {
    next()
    return
  }
  let auth = CollabAuthentication
  let authenticated = auth.methods.getAuthResponse()
  if (!authenticated) {
    saveQueryParams()
    next({path: loginPath})
    return
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router
})

function saveQueryParams () {
  // Save this becuase an issue with hash and query params when get the access_token using hellojs
  let match = window.location.href.match(new RegExp('#\\/(.*)'))
  if (match && match.length > 0 && match[1] !== '' && !match[1].startsWith('access_token')) {
    console.debug('Saving query param', match[1])
    window.localStorage.setItem('query', match[1])
  }
}
