<template>
   <div class="single-cell-insilico-experiments">
    <div class="title-uc">Please select a model</div>
    <div class="content-uc">
      <div v-for="model in models" :key="model.title">
        <models-list
          :models="models"
          v-on:selected="touched">
        </models-list>
      </div>
    </div>
   </div>
</template>

<script>
   import striatalList from '@/components/singlecellmodeling/striatal/striatal-list.vue'
   import createCollab from '@/mixins/createCollab.js'
   import modelsMixins from '@/mixins/models.js'

   export default {
    props: ['uc_name'],
    name: 'modelContainer',
    components: {
        'models-list': striatalList
    },
    data () {
      return {
        models: [],
        ucName: 'optimizeastriatalfast-spikinginterneuron'
      }
    },
    mixins: [createCollab],
    methods: {
      touched (modelItem) { // open Neuron as a service
        this.$router.push({name: 'sc_striatal_form_replacing',
          params: {
            'folder_name': modelItem.modelName
          }
        })
      }
    },
    created () {
      this.models = modelsMixins.getModelByUc(this.ucName)
      document.querySelector('title').innerHTML = 'Striatal Models'
    }
  }
</script>
