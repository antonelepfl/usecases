<template>
   <div class="model-container">
      <div class="title-uc">Please select a model</div>
      <div class="content-uc">
         <div v-for="model in models" :key="model.title" v-on:click="selected(model)" v-bind:class="{ 'disabled-container': model.disabled }">
         <div v-if="model.disabled" class="disabled-tag">Coming Soon</div>
            <md-whiteframe md-elevation="2" v-bind:class="{ 'item-sections': true, 'disabled-item': model.disabled }">
               <model-item v-bind:model="model"></model-item>
            </md-whiteframe>
         </div>
      </div>
   </div>
</template>

<script>
   import modelItem from './model-item.vue'
   import modelsMixins from '@/mixins/models.js'
   import { compact } from '@/mixins/utils.js'

   export default {
      name: 'modelContainer',
      components: {
         'model-item': modelItem
      },
      props: ['uc_name'],
      data () {
         return {
            models: [],
            list_usecases: 'brainareacircuitinsilicoexperiments'
         }
      },
      methods: {
         selected (model) {
            if (!model.disabled) {
              if (model.files) {
                this.$router.push({name: 'brainarea_form',
                   params: {
                      'model_name': compact(model.title)
                   }
                })
              } else {
                window.open('https://bbp.epfl.ch/public/simulationapp/index.html#/', '_blank');
              }
            }
         }
      },
      created () {
        document.querySelector('title').innerHTML = 'Models'
        this.models = modelsMixins.getModelByUc(this.uc_name)
      }
   }
</script>
