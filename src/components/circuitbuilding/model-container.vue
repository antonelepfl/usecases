<template>
   <div class="model-container">
      <div class="title">Please select a model</div>
      <div v-for="model in models" v-on:click="selected(model)" v-bind:class="{ 'disabled-container': model.disabled }">
      <div v-if="model.disabled" class="disabled-tag">Coming Soon</div>
         <md-whiteframe md-elevation="2" v-bind:class="{ 'item-sections': true, 'disabled-item': model.disabled }">
            <model-item v-bind:model="model"></model-item>
         </md-whiteframe>
      </div>
   </div>
</template>

<script>
   import modelItem from './model-item.vue'
   import ModelsConfig from 'assets/config_files/models.json'
   import CollabAuthentication from 'mixins/collabAuthentication.js'
   import circuitbuilding from 'mixins/circuitbuilding.js'

   export default {
      name: 'modelContainer',
      components: {
         'model-item': modelItem
      },
      props: ['uc_name'],
      mixins: [CollabAuthentication, circuitbuilding],
      data () {
         return {
            modelsConfig: ModelsConfig,
            models: [],
            list_usecases: 'circuitbuilding'
         }
      },
      methods: {
         selected (model) {
           if (!model.disabled) {
             var pathName = this.uglyfy(model.title)
             this.$router.push({
               name: 'cb_form',
               params: {'model_name': pathName}
            })
           }
         }
      },
      created () {
        document.querySelector('title').innerHTML = 'Models'
        var currentModelList = this.modelsConfig[this.list_usecases];
        this.models = currentModelList[this.uc_name]
      }
   }
</script>

<style scoped>
   .model-container {
      padding: 10px;
      margin-top: 50px;
   }
   .model-container.no-title {
      padding: 10px;
      margin-top: 0;
   }
   .model-container .item-sections {
      margin-top: 20px;
      padding: 10px;
      cursor: pointer;
   }
   .model-container .selected {
      background-color: lightgray;
      transition: background-color 0.5s ease;
   }
   .model-container > .title {
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
      z-index: 3;
   }
   .model-container .disabled-tag {
      position: absolute;
      top: 15%;
      left: 45%;
      font-weight: 700;
      border: 10px solid #bacfcb;
      background-color: #bacfcb;
      border-radius: 5px;
      z-index: 2;
   }
   .model-container .disabled-item {
      opacity: 0.5;
      background-color: rgba(63, 58, 58, 0.22);
      cursor: not-allowed;
   }
   .model-container .disabled-item:hover {
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
   }
   .model-container .disabled-container {
      position: relative;
   }
   @media screen and (max-width: 751px) {
      .model-container .disabled-tag {
         left: 35%;
      }
   }
</style>
