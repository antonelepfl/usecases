<template>
   <div class="morphology-model-container" v-if="authenticated">
      <ca1-model-list v-on:selected="touched"></ca1-model-list>
   </div>
</template>

<script>
   import ca1ModelList from 'components/singlecellmodeling/ca1-model-list.vue'
   import collabAuthentication from 'mixins/collabAuthentication.js'
   const VIEWER_URL = 'https://morph-view-bsp.humanbrainproject.eu/'
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
          let viewUrl = ''
          switch (this.uc_name) {
            case 'morphologyvisualization':
              viewUrl = VIEWER_URL + modelItem.folderName + '.html'
              window.open(viewUrl, '_blank');
              break;
            case 'morphologyanalysis':
              this.$router.push({name: 'morph_form_replacing',
                params: {
                  'folder_name': modelItem.folderName
                }
              })
              break;
          }
        }
      }
   }
</script>

<style scoped>

</style>
