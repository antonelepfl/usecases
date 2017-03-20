<template>
   <div class="model-container">
      <div class="title">Please select a model</div>
      <div v-for="model in models" v-on:click="selected(model)">
         <md-whiteframe md-elevation="2" class="item-sections">
            <model-item v-bind:model="model"></model-item>
         </md-whiteframe>
      </div>
   </div>
</template>

<script>
   import modelItem from './model-item.vue'
   import ModelsConfig from 'assets/config_files/models.json';

   export default {
      name: 'modelContainer',
      components: {
         'model-item': modelItem
      },
      // props: ['singlePage', 'next'],
      props: ['next', 'single', 'model_name', 'list_usecases'],
      data () {
         return {
            modelsConfig: ModelsConfig,
            models: []
         }
      },
      methods: {
         selected (model) {
           var pathName = this.$route.params.model_name
           pathName = pathName + model.species
           pathName = pathName + model.brain_structure
           pathName = pathName + model.cell_soma_location
           pathName = pathName.toLowerCase()
           this.$router.push({name: 'cb_form', params: {'uc_name': pathName}})
         },
         prettyfy (name) {
            return name.split('_').map(function (word) {
               return word.charAt(0).toUpperCase() + word.slice(1)
            }).join(' ')
         }
      },
      mounted () {
        document.querySelector('title').innerHTML = 'Models'
        var that = this
        var currentModel = this.modelsConfig[this.list_usecases];
        var tempIndex = 0;
        for (var i = 0; i < currentModel.length; i++) {
          this.$http.get(currentModel[i].path).then(function (response) {
            var a = JSON.parse(response.body)
            a['img'] = currentModel[tempIndex].img
            tempIndex = tempIndex + 1
            that.models.push(a)
          }, function (error) {
            console.log(error)
          })
        }
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
