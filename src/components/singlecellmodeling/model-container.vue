<template>
   <div class="model-container">
      <div class="title">Please select a model</div>
      <div class="content">
      <!--<section v-for="(value, key) in usercases">
         <div v-for="model in value" v-on:click="selected" >-->
            <md-whiteframe md-elevation="1" class="item-sections" v-for="model in models">
               <model-item
                  class="model-item"
                  :model="model"
                  v-on:showimage="showimage"
                  v-on:touched="touched(model)"></model-item>
            </md-whiteframe>

            <modal-component v-if="showModal" v-on:close="showModal = false">
               <img slot="image" v-bind:src="modalSrc"/>
               <h3 slot="header"> {{ path }}</h3>
            </modal-component>
         <!--</div>
      </section>  end categories -->
      </div>
   </div>
</template>

<script>
   import modelItem from './model-item.vue'
   import modalComponent from '../modal-component.vue'
   import ModelsConfig from 'assets/config_files/models.json'
   import ModelsArray from 'assets/config_files/singlecellmodeling_structure.json'
   export default {
      name: 'modelContainer',
      components: {
         modelItem, modalComponent
      },
      props: ['list_usecases', 'model_name'],
      data () {
         return {
            showModal: false,
            modalSrc: String,
            modelsConfig: {},
            models: []
         }
      },
      methods: {
         showimage () {
            /* eslint no-undef: 0 */
            this.modalSrc = event.currentTarget.src
            this.path = ''
            let parentRoot = event.target.offsetParent
            if (parentRoot) {
              this.path = parentRoot.querySelector('.path').innerText
            }
            this.showModal = true
         },
         touched (modelItem) {
            this.$router.push({name: 'sm_form',
              params: {
                'morphology': modelItem.morphology,
                'list_usecases': this.list_usecases,
                'model_name': this.model_name
              }
            })
         },
         getMetadata: function (folderContent) {
           let that = this;
           for (let i = 0; i < folderContent.length; i++) {
             let elem = folderContent[i]
             let fileName = Object.keys(elem)[0]
             let modelInfo = elem[fileName].meta
             let morphPath = that.modelsConfig.raw + fileName + '/' + elem[fileName].morph
             modelInfo.morphImg = morphPath
             let responsePath = that.modelsConfig.raw + fileName + '/' + elem[fileName].responses
             modelInfo.reponsesImg = responsePath
             that.models.push(modelInfo)
           }
         }
      },
      created () {
        this.modelsConfig = ModelsConfig[this.model_name]
        document.querySelector('title').innerHTML = 'Models'
        this.getMetadata(ModelsArray)
      }
   }
</script>

<style scoped>
   .model-container {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
   }
   .model-container .content {
      padding: 10px;
      margin-top: 50px;
   }
   .model-container .item-sections {
      margin-top: 10px;
      margin-bottom: 15px;
      padding: 9px;
      border: 3px solid white;
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
      z-index: 2;
   }
   .model-container .item-sections:hover {
      transition: 0.3s ease;
      box-shadow: 0 6px 6px -3px rgba(0, 0, 0, 0.2), 0 10px 14px 1px rgba(0, 0, 0, 0.14), 0 4px 18px 3px rgba(0, 0, 0, 0.12);
   }
   .model-container .touched {
      animation: shake 0.5s;
      border: 3px solid;
   }
   @keyframes shake {
      0% {border: 3px solid white;}
      50% {border: 3px solid gray;}
      100% {border: 3px solid black;}
   }
   @-webkit-keyframes shake {
      0% {border: 3px solid white;}
      50% {border: 3px solid gray;}
      100% {border: 3px solid black;}
   }
</style>
