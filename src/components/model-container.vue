<template>
   <div class="model-container">
      <div class="title">Please select a model</div>
      <div class="content">
      <!--<section v-for="(value, key) in usercases">
         <div v-for="model in value" v-on:click="selected" >-->      
            <md-whiteframe md-elevation="1" class="item-sections">
               <model-item 
                  class="model-item" 
                  path="Rat>Somatosensory Cortex>L5_TTPC1>cAD>C060114A2" 
                  v-on:showimage="showimage" 
                  v-on:touched="touched"
                  author="Werner Van Geit (werner.vangeit@epfl.ch)"></model-item>
            </md-whiteframe>
      
            <md-whiteframe md-elevation="1" class="item-sections">
               <model-item 
                  class="model-item" 
                  path="Rat>Hippocampus>SP_PC>cAD>010710HP2" 
                  v-on:showimage="showimage" 
                  v-on:touched="touched"
                  author="Michele Migliore (michele.migliore@pa.ibf.cnr.it)"></model-item>
            </md-whiteframe>

            <md-whiteframe md-elevation="1" class="item-sections">
               <model-item 
                  class="model-item" 
                  path="Rat>Cerebellum>Purkinje>cAD>270911C" 
                  v-on:showimage="showimage" 
                  v-on:touched="touched"
                  author="Egidido D’Angelo (dangelo@unipv.it)"></model-item>
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
   import modalComponent from './modal-component.vue'
   export default {
      name: 'modelContainer',
      components: {
         modelItem, modalComponent
      },
      data () {
         return {
            showModal: false,
            modalSrc: String
         }
      },
      methods: {
         showimage (elem) {
            // src comes from the native element in model-item
            this.modalSrc = elem.src
            this.path = elem.path
            this.showModal = true
         },
         touched (modelItem) {
            this.$el.querySelectorAll('.touched').forEach(function (elem) {
               elem.classList.remove('touched')
            })
            modelItem.parentNode.classList.add('touched')
         }
      },
      created () {
         document.querySelector('title').innerHTML = 'Models'
      }
   }
</script>

<style>
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
   .item-sections {
      margin-top: 10px;
      margin-bottom: 15px;
      padding: 9px;
      border: 2px solid white;
   }
   .selected {
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
   .item-sections:hover {
      transition: 0.3s ease;
      box-shadow: 0 6px 6px -3px rgba(0, 0, 0, 0.2), 0 10px 14px 1px rgba(0, 0, 0, 0.14), 0 4px 18px 3px rgba(0, 0, 0, 0.12);
   }
   .touched {
      animation: shake 0.3s;
      border: 2px solid;
   }
   @keyframes shake {
      0% {border: 2px solid white;}
      50% {border: 2px solid gray;}
      100% {border: 2px solid black;}
   } 
   @-webkit-keyframes shake {
      0% {border: 2px solid white;}
      50% {border: 2px solid gray;}
      100% {border: 2px solid black;}
   } 
</style>