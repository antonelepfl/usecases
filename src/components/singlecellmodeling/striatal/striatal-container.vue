<template>
   <div class="single-cell-insilico-experiments">
    <div class="title">Please select a model</div>
    <div class="content">
      <div v-for="model in models">
        <models-list
          :models="models"
          v-on:selected="touched">
        </models-list>
      </div>
    </div>
   </div>
</template>

<script>
   import striatalList from 'components/singlecellmodeling/striatal/striatal-list.vue'
   import createCollab from 'mixins/createCollab.js'
   import ModelsConfig from 'assets/config_files/models.json'

   export default {
      name: 'modelContainer',
      components: {
         'models-list': striatalList
      },
      data () {
        return {
          models: [],
          list_usecases: 'singlecellmodeling',
          uc_name: 'optimizeastriatalfast-spikinginterneuron'
        }
      },
      mixins: [createCollab],
      methods: {
        touched (modelItem) { // open Neuron as a service
          this.$router.push({name: 'sc_striatal_form_replacing',
            params: {
              'folder_name': modelItem.modelName,
              'uc_name': this.uc_name
            }
          })
        }
      },
      created () {
        this.models = ModelsConfig[this.list_usecases][this.uc_name]
        document.querySelector('title').innerHTML = 'Striatal Models'
      }
   }
</script>

<style scoped>
.title {
  box-shadow: 0 2px 5px rgba(0,0,0,.26);
  position: fixed;
  text-align: left;
  color: #fff;
  background-color: rgba(172, 96, 103, 0.95);
  padding: 20px;
  font-size: 20px;
  font-weight: 600;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
}
.content {
  padding: 10px;
  margin-top: 50px;
}
</style>
