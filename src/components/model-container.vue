<template>
   <div class="model-container">
      <!--<section v-for="(value, key) in usercases">
         <div v-for="model in value" v-on:click="selected" >-->
            <md-whiteframe md-elevation="2" class="item-sections">
               <model-item class="model-item" path="Rat > SSCx > L5_TTPC1 > cAD" v-on:showimage="showimage" ></model-item>
            </md-whiteframe>

            <md-whiteframe md-elevation="2" class="item-sections">
               <model-item class="model-item" path="Rat > Hippocampus > ..." v-on:showimage="showimage"></model-item>
            </md-whiteframe>

            <md-whiteframe md-elevation="2" class="item-sections">
               <model-item class="model-item" path="Rat > Cerebellum > ..." v-on:showimage="showimage"></model-item>
            </md-whiteframe>

            <modal-component v-if="showModal" v-on:close="showModal = false">
               <img slot="image" v-bind:src="modalSrc"/>
               <h3 slot="header"> {{ path }}</h3>
            </modal-component>
         <!--</div>
      </section>  end categories -->
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
         }
      },
      created () {
         document.querySelector('title').innerHTML = 'Models'
      }
   }
</script>

<style>
   .model-container {
      padding: 10px;
   }
   .item-sections {
      margin-top: 20px;
      padding: 10px;
   }
   .selected {
      background-color: lightgray;
      transition: background-color 0.5s ease;
   }
</style>