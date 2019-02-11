<template>
   <div class="single-cell-insilico-experiments">
    <div class="title-uc">Please select a model</div>
    <div class="content-uc">
      <md-whiteframe md-elevation="1">
        <div class="search-container-models">
          <i class="material-icons">search</i>
          <input class="searchbox-models" type="text" v-model="filter" placeholder="Search e.g 'Hippocampus' or click on the item's title to filter">
        </div>
      </md-whiteframe>
      <models-list :models="models" v-on:selected="touched" v-on:tagfilter="addSearch"></models-list>
    </div>
   </div>
</template>

<script>
   import BspNmcModelList from '@/components/shared/models-list.vue'
   const VIEWER_URL = 'https://blue-naas.humanbrainproject.eu/#/'
   import collabAuthentication from '@/mixins/collabAuthentication.js'
   import createCollab from '@/mixins/createCollab.js'
   import modelsMixins from '@/mixins/models.js'

   export default {
      name: 'modelContainer',
      components: {
         'models-list': BspNmcModelList
      },
      data () {
        return {
          models: [],
          originalModels: [],
          filter: ''
        }
      },
      mixins: [collabAuthentication, createCollab],
      props: ['list_usecases', 'uc_name'],
      methods: {
        touched (modelItem) { // open Neuron as a service
          var category = this.$route.path.split('/')[1]
          this.sendStatistics(null, this.uc_name, category, modelItem.folderName, null)
          let modelBlueNaasUrl = modelItem.modelZipBase ?
            `url/${modelItem.zip_url.replace(modelItem.modelZipBase, '')}` :
            `model/${modelItem.folderName}`

          window.open(VIEWER_URL + modelBlueNaasUrl, '_blank');
        },
        addSearch (obj) {
          this.filter += ' ' + obj.text
        },
        performRestModels () {
          const granule = modelsMixins.getGranuleMetadata()
          const purkinje = modelsMixins.getPurkinjeMetadata()
          const nmc = modelsMixins.getNMCMetadata()
          this.models = this.models.concat(granule, nmc, purkinje)
          this.originalModels = this.models // save all the models
        }
      },
      created () {
        document.querySelector('title').innerHTML = 'Models'
        this.models = modelsMixins.getHippocampusMetadata()
        window.requestIdleCallback ?
          window.requestIdleCallback(this.performRestModels) :
          this.performRestModels();
      },
      watch: {
        'filter': async function (newVal) {
          this.models = await modelsMixins.search(newVal, this.originalModels)
        }
      }
   }
</script>
