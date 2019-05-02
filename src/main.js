// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import App from '@/components/app.vue';
import Default from '@/components/default-list.vue';
import DefaultForm from '@/components/traceanalysis/ta-form.vue';
import CollabAuthentication from '@/mixins/collabAuthentication';
import axios from 'axios';
import '@/assets/general.css';
import '@/mixins/sentry';

import CBModelContainer from '@/components/circuitbuilding/model-container.vue';
import CBForm from '@/components/circuitbuilding/cb-form.vue';

import SCMForm from '@/components/singlecellmodeling/striatal/form-replacing.vue';
import SCMModelContainer from '@/components/singlecellmodeling/model-container.vue';
import SCMModelForm from '@/components/singlecellmodeling/model-form.vue';

import MorphAnalysis from '@/components/morphology/analysis-model-container.vue';
import MorphViewer from '@/components/morphology/viewer-model-container.vue';
import MorphForm from '@/components/morphology/form-replacing.vue';

import MoocCourseContainer from '@/components/mooc/course-container.vue';
import MoocForm from '@/components/mooc/mooc-form.vue';
import MoocWeekContainer from '@/components/mooc/weeks-container.vue';

import SCMStriatalContainer from '@/components/singlecellmodeling/striatal/striatal-container.vue';
import SSIEModelContainer from '@/components/singlecellinsilicoexperiments/model-container.vue';
import BACISEModelContainer from '@/components/brainareacircuitinsilicoexperiments/model-container.vue';
import SCIEModelContainer from '@/components/smallcircuitinsilicoexperiments/model-container.vue';
import HBPSchoolForm from '@/components/hbpschool/hbp-school-form.vue';
import TermAndConditions from '@/components/terms-and-conditions.vue';
import EntityFormReplace from '@/components/entitydashboard/form-replacing.vue';

Vue.use(VueMaterial);
Vue.use(VueRouter);

Vue.prototype.$http = axios;

const router = new VueRouter({
  routes: [
    // ============================ trace analysis ============================
    {
      path: '/traceanalysis/:uc_name',
      component: DefaultForm,
      props: true,
      name: 'ta_form',
    },
    // ============================ circuit building ============================
    {
      path: '/circuitbuilding/:uc_name',
      component: CBModelContainer,
      props: true,
      name: 'cb_models',
    },
    {
      path: '/circuitbuilding/:uc_name/:model_name',
      component: CBForm,
      props: true,
      name: 'cb_form',
    },
    // ============================ singlecellmodeling ============================
    {
      path: '/singlecellmodeling/form/:uc_name',
      component: DefaultForm,
      props: true,
      name: 'sc_form',
    },
    {
      path: '/singlecellmodeling/optimizeastriatalfast-spikinginterneuron',
      component: SCMStriatalContainer,
      name: 'sc_striatal_models',
    },
    {
      path: '/singlecellmodeling/optimizeastriatalfast-spikinginterneuron/:folder_name',
      component: SCMForm,
      props: true,
      name: 'sc_striatal_form_replacing',
    },
    {
      path: '/singlecellmodeling/:uc_name',
      component: SCMModelContainer,
      props: true,
      name: 'sc_models',
    },
    {
      path: '/singlecellmodeling/:uc_name/:folder_name',
      component: SCMModelForm,
      props: true,
      name: 'sc_models_form',
    },
    // ============================ moprhology ============================
    {
      path: '/morphology/morphologyvisualization/',
      redirect: '/morphology/morphologyvisualization/view',
    },
    {
      path: '/morphology/:uc_name',
      component: MorphAnalysis,
      props: true,
      name: 'morph_analysis_models',
    },
    {
      path: '/morphology/:uc_name/view',
      component: MorphViewer,
      props: true,
      name: 'morph_viewer_models',
    },
    {
      path: '/morphology/:uc_name/:folder_name',
      component: MorphForm,
      props: true,
      name: 'morph_form_replacing',
    },
    // ================= singlecellinsilicoexperiments ================
    {
      path: '/singlecellinsilicoexperiments/:uc_name',
      component: SSIEModelContainer,
      props: true,
      name: 'insilico_exp',
    },
    // ================= brainareacircuitinsilicoexperiments ================
    {
      path: '/brainareacircuitinsilicoexperiments/:uc_name',
      component: BACISEModelContainer,
      props: true,
      name: 'brainarea_circuits',
    },
    {
      path: '/brainareacircuitinsilicoexperiments/:uc_name/:model_name',
      component: CBForm,
      props: true,
      name: 'brainarea_form',
    },
    // ============================ mooc ============================
    {
      path: '/mooc/',
      component: MoocCourseContainer,
      props: true,
      name: 'mooc_container',
    },
    {
      path: '/mooc/:uc_name/:week',
      component: MoocForm,
      props: true,
      name: 'mooc_form',
    },
    {
      path: '/mooc/:uc_name/',
      component: MoocWeekContainer,
      props: true,
      name: 'weeks_container',
    },
    // ================= small circuit in silico experiments ================
    {
      path: '/smallcircuitinsilicoexperiments/:uc_name',
      component: SCIEModelContainer,
      props: true,
      name: 'small_circuit_model_container',
    },
    {
      path: '/smallcircuitinsilicoexperiments/:uc_name/:model_name',
      component: CBForm,
      props: true,
      name: 'small_circuit_form',
    },
    // ================= hbp school ================
    {
      path: '/hbpschool/:uc_name/',
      component: HBPSchoolForm,
      props: true,
      name: 'hbp_school_form',
    },
    // ================= terms and conditions ================
    {
      path: '/termsandconditions/:list_usecases/:uc_name',
      component: TermAndConditions,
      props: true,
      name: 'termsandconditions',
    },
    // ================= entity dashboard integration ================
    {
      path: '/entitydashboard/',
      component: EntityFormReplace,
      props: true,
      name: 'entitydashboard',
    },
    // ================= default ================
    {
      path: '/',
      redirect: '/traceanalysis',
    },
    // ============================ rest of UC ============================
    {
      path: '/:list_usecases', // display the UC bases on the key of usecases.json
      component: Default,
      props: true, // to see in the component as props
    },
    {
      path: '/:list_usecases/:uc_name',
      component: DefaultForm,
      props: true,
    },
  ],
  base: '/usecases/',
  scrollBehavior() {
    // to scroll to the top every change of route
    return { x: 0, y: 0 };
  },
});

/* eslint-disable no-new */
const app = new Vue({
  router,
  render: h => h(App),
});

CollabAuthentication.init()
  .then(() => {
    app.$mount('#app');
  });
