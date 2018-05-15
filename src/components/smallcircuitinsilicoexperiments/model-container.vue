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
   import modelList from '@/components/singlecellmodeling/striatal/striatal-list.vue'
   import createCollab from '@/mixins/createCollab.js'
   import modelsMixins from '@/mixins/models.js'

   export default {
    props: ['uc_name'],
    name: 'modelContainer',
    components: {
        'models-list': modelList
    },
    data () {
      return {
        models: [],
        ucName: 'configureandrunasmallcircuitusingpreconfiguredhbpmodelanddata'
      }
    },
    mixins: [createCollab],
    methods: {
      touched (modelItem) { // open form or pair recording
        if (modelItem.title === 'Mouse O1 - Scaffold Somatosensory Cortex Microcircuit for Mouse') {
          window.open('https://bsp-mouse-o1.humanbrainproject.eu/', '_blank')
          return
        }
        this.$router.push({name: 'small_circuit_form',
          params: {
            'folder_name': modelItem.modelName
          }
        })
      }
    },
    created () {
      this.models = modelsMixins.getModelByUc(this.ucName)
      document.querySelector('title').innerHTML = 'Small Circuits In Silico Experiments'
    }
  }
</script>
