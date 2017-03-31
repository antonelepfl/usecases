<template>
   <div class="model-container">
      <ca1-model-list v-on:selected="touched"></ca1-model-list>
   </div>
</template>

<script>
   import ca1ModelList from './ca1-model-list.vue'
   export default {
      name: 'modelContainer',
      components: {
         'ca1-model-list': ca1ModelList
      },
      props: ['list_usecases', 'uc_name'],
      methods: {
        touched (modelItem) { // open the 3D viewer or continue with the collab search
          this.$router.push({name: 'cb_models_form',
            params: {
              'uc_name': this.uc_name
            }
          })
        }
      }
   }
</script>

<style scoped>

</style>
