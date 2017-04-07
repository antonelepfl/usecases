<template>
   <div class="morphology-model-container">
      <ca1-model-list v-on:selected="touched"></ca1-model-list>
   </div>
</template>

<script>
   import ca1ModelList from 'components/singlecellmodeling/ca1-model-list.vue'
   const VIEWER_URL = 'https://morph-view-bsp.humanbrainproject.eu/'
   export default {
      name: 'modelContainer',
      components: {
         'ca1-model-list': ca1ModelList
      },
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
                  'folder_name': modelItem.folderName,
                  'list_usecases': 'morphology',
                  'model_name': this.uc_name
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
