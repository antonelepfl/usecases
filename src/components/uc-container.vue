<template>
   <div class="uc-container">
      <section v-for="(value, key) in usercases">
         <div v-for="uc in value" v-on:click="selected" >
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
            this.$el.querySelectorAll('.selected').forEach(function (elem) {
               elem.classList.remove('selected')
            })
            event.currentTarget.classList.toggle('selected')
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