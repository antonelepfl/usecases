<template>
   <div class="uc-container">
      <section v-for="(value, key) in usercases">
         <div v-for="uc in value" v-on:click="selected">
            <md-whiteframe md-elevation="2" class="item-sections">
               <uc-item class="uc-item" v-bind:uc="uc" v-bind:categories="categories"></uc-item>
            </md-whiteframe>
         </div>
      </section> <!-- end categories -->
   </div>
</template>

<script>
   import ucItem from './uc-item.vue'
   var usercases = require('../assets/usercases.json')
   var routes = require('../assets/routes.json')
   export default {
      name: 'ucContainer',
      components: {
         ucItem
      },
      data () {
         return {
            usercases: usercases[0],
            categories: usercases[1].categories
         }
      },
      methods: {
         selected (event) {
            this.$router.push(routes.models)
         }
      }
   }
</script>

<style>
   .uc-container {
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