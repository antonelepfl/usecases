<template>
   <div class="ca1-model-list">
      <div class="title">Please select a model</div>
      <div class="content">
        <md-whiteframe md-elevation="1">
          <div class="search-container">
            <i class="material-icons">search</i>
            <input class="searchbox" type="text" v-model="filter" placeholder="Search e.g 'Hippocampus' or click on the item's title to filter">
          </div>
        </md-whiteframe>
        <models-list :models="models" v-on:selected="touched" v-on:tagfilter="addSearch"></models-list>
      </div>
   </div>
</template>

<script>
   import modelItem from 'components/singlecellinsilicoexperiments/models-list.vue'
   import modelsMixins from 'mixins/models.js'
   import ModelsConfig from 'assets/config_files/models.json'
   import ModelsBSP from 'assets/config_files/singlecellmodeling_structure.json'

   export default {
      name: 'ca1ModelList',
      components: {
         'models-list': modelItem
      },
      data () {
         return {
            models: [],
            originalModels: [],
            filter: ''
         }
      },
      mixins: [modelsMixins],
      methods: {
        touched (modelItem) {
          this.$emit('selected', modelItem)
        },
        addSearch (obj) {
          this.filter += ' ' + obj.text
        }
      },
      created () {
        let modelsConfigBSP = ModelsConfig['ca1models']
        document.querySelector('title').innerHTML = 'Models'
        this.originalModels = this.getBSPMetadata(ModelsBSP, modelsConfigBSP.raw)
        this.models = this.originalModels
      },
      watch: {
        'filter': async function (newVal) {
          this.models = await this.search(newVal, this.originalModels)
        }
      }
   }
</script>

<style scoped>
   .ca1-model-list {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
   }
   .ca1-model-list .content {
      padding: 10px;
      margin-top: 50px;
   }
   .ca1-model-list .item-sections {
      margin-top: 10px;
      margin-bottom: 15px;
      padding: 9px;
      border: 3px solid white;
   }
   .ca1-model-list .selected {
      background-color: lightgray;
      transition: background-color 0.5s ease;
   }
   .ca1-model-list > .title {
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
   .ca1-model-list .item-sections:hover {
      transition: 0.3s ease;
      box-shadow: 0 6px 6px -3px rgba(0, 0, 0, 0.2), 0 10px 14px 1px rgba(0, 0, 0, 0.14), 0 4px 18px 3px rgba(0, 0, 0, 0.12);
   }
   .ca1-model-list .touched {
      animation: shake 0.5s;
      border: 3px solid;
   }
    .search-container {
      display: flex;
      align-items: center;
      margin: 20px 0;
      padding: 10px;
      background-color: #cfe2e8;
    }
    .searchbox {
      font-size: 22px;
      padding-left: 30px;
      border: 1px solid #ddd;
      margin-bottom: 0;
      margin-left: 12px;
      width: 100%;
    }
</style>
