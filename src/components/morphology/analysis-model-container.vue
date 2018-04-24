<template>
   <div class="morphology-model-container">
      <ca1-model-list v-on:selected="touched"></ca1-model-list>
   </div>
</template>

<script>
   import ca1ModelList from '@/components/singlecellmodeling/ca1-model-list.vue'
   import collabAuthentication from '@/mixins/collabAuthentication.js'
   import createCollab from '@/mixins/createCollab.js'
   export default {
      name: 'modelContainer',
      components: {
         'ca1-model-list': ca1ModelList
      },
      mixins: [collabAuthentication, createCollab],
      props: ['list_usecases', 'uc_name'],
      methods: {
        touched (modelItem) {
          this.$router.push({name: 'morph_form_replacing',
            params: {
              'folder_name': modelItem.folderName
            }
          })
        }
      }
   }
</script>