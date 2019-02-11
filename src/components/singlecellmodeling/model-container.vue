<template>
   <div class="model-container">
      <ca1-model-list v-on:selected="touched"></ca1-model-list>
   </div>
</template>

<script>
   import ca1ModelList from '@/components/shared/ca1-model-list.vue'
   import collabAuthentication from '@/mixins/collabAuthentication.js'
   export default {
      name: 'modelContainer',
      components: {
         'ca1-model-list': ca1ModelList
      },
      props: ['list_usecases', 'uc_name'],
      mixins: [collabAuthentication],
      methods: {
        touched (modelItem) {
          this.$router.push({name: 'sc_models_form',
            params: {
              'folder_name': modelItem.folderName
            }
          })
        }
      }
   }
</script>
