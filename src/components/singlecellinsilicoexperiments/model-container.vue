<template>
   <div class="single-cell-insilico-experiments" v-if="authenticated">
      <ca1-model-list v-on:selected="touched"></ca1-model-list>
   </div>
</template>

<script>
   import ca1ModelList from 'components/singlecellmodeling/ca1-model-list.vue'
   const VIEWER_URL = 'https://blue-naas.humanbrainproject.eu/#/model/'
   import collabAuthentication from 'mixins/collabAuthentication.js'
   import createCollab from 'mixins/createCollab.js'
   
   export default {
      name: 'modelContainer',
      components: {
         'ca1-model-list': ca1ModelList
      },
      data: function () {
        return {
          authenticated: false
        }
      },
      mixins: [collabAuthentication, createCollab],
      props: ['list_usecases', 'uc_name'],
      methods: {
        touched (modelItem) { // open Neuron as a service
          this.sendStatistics(null, this.uc_name, modelItem.folderName, null)
          let viewUrl = VIEWER_URL + modelItem.folderName
          window.open(viewUrl, '_blank');
        }
      }
   }
</script>

<style scoped>

</style>
