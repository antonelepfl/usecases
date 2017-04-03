<template>
   <div class="ca1-model-list">
      <div class="title">Please select a model</div>
      <div class="content">
        <md-whiteframe md-elevation="1">
          <div class="search-container">
            <i class="material-icons">search</i>
            <input class="searchbox" type="text" v-model="filter" placeholder="Search synthesis">
          </div>
        </md-whiteframe>

        <md-whiteframe md-elevation="1" class="item-sections" v-for="model in models">
          <model-item
            class="model-item"
            :model="model"
            v-on:touched="touched(model)"
            v-on:addSearch="addSearch"></model-item>
        </md-whiteframe>
      </div>
   </div>
</template>

<script>
   import modelItem from './model-item.vue'
   import ModelsConfig from 'assets/config_files/models.json'
   import ModelsArray from 'assets/config_files/singlecellmodeling_structure.json'
   export default {
      name: 'ca1ModelList',
      components: {
         'model-item': modelItem
      },
      data () {
         return {
            modelsConfig: {},
            models: [],
            filter: ''
         }
      },
      methods: {
        touched (modelItem) {
          this.$emit('selected', modelItem)
        },
        getMetadata (folderContent) {
          let that = this;
          for (let i = 0; i < folderContent.length; i++) {
            let elem = folderContent[i]
            let fileName = Object.keys(elem)[0]
            let modelInfo = elem[fileName].meta
            let morphPath = that.modelsConfig.raw + fileName + '/' + elem[fileName].morph
            modelInfo.morphImg = morphPath
            let responsePath = that.modelsConfig.raw + fileName + '/' + elem[fileName].responses
            modelInfo.reponsesImg = responsePath
            modelInfo.folderName = fileName
            that.models.push(modelInfo)
          }
        },
        addSearch (obj) {
          this.filter += ' ' + obj.text
        },
        search (text) {
          var paths = this.$el.querySelectorAll('.path')
          var textParts = text.split(' ')
          // Loop through all table rows, and hide those who don't match the search query
          for (let i = 0; i < paths.length; i++) {
            let j = 0
            let partsFound = 0
            while (j < textParts.length) {
              let filter = textParts[j]
              filter = filter.toUpperCase()
              let path = paths[i].innerText.toUpperCase()
              if (path.indexOf(filter) >= 0) {
                partsFound = partsFound + 1
              }
              j++;
            }
            if (partsFound === textParts.length) { // it is the last element in the row and found all
              paths[i].parentElement.parentElement.style.display = '';
            } else {
              paths[i].parentElement.parentElement.style.display = 'none';
            }
          }
        }
      },
      created () {
        this.modelsConfig = ModelsConfig['ca1models']
        document.querySelector('title').innerHTML = 'Models'
        this.getMetadata(ModelsArray)
      },
      watch: {
        'filter': function (newVal) {
          this.search(newVal)
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
