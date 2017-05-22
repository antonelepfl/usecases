<template>
   <div class="single-cell-insilico-experiments" v-if="authenticated">
      <ca1-model-list v-on:selected="touched"></ca1-model-list>
   </div>
</template>

<script>
   import ca1ModelList from 'components/singlecellmodeling/ca1-model-list.vue'
   const VIEWER_URL = 'https://blue-naas.humanbrainproject.eu/#/model/'
   import collabAuthentication from 'mixins/collabAuthentication.js'
   
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
      mixins: [collabAuthentication],
      props: ['list_usecases', 'uc_name'],
      methods: {
        touched (modelItem) { // open the 3D viewer or continue with the collab search
          let viewUrl = VIEWER_URL + modelItem.folderName
          window.open(viewUrl, '_blank');
        }
      }
   }
</script>

<style scoped>

</style>
