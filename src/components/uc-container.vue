<template>
   <div id="uc-container" class="uc-container">
      <div id="uc-container-title" class="title">Please select one use case</div>
      <section v-for="(value, key) in usercases" class="uc-item-container">
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
            categories: usercases[1].categories,
            spa: false
         }
      },
      methods: {
         selected (event) {
            this.$el.querySelectorAll('.selected').forEach(function (elem) {
               elem.classList.remove('selected')
            })
            event.currentTarget.classList.add('selected')
            if (this.spa === true) {
               this.$router.push(routes.usecases.models)
            }
         }
      },
      mounted () {
         if (this.$route.fullPath === routes.usecases.usecases) {
            this.spa = true
         } else {
            this.$el.querySelector('#uc-container-title').remove()
            this.$el.querySelector('.uc-item-container').classList.add('no-title')
         }
      }
   }
</script>

<style>
   .uc-container .uc-item-container {
      padding: 10px;
      margin-top: 50px;
   }
   .item-sections {
      margin-top: 20px;
      padding: 10px;
   }
   .uc-item-container.no-title {
      margin-top: 0px;
   }
   .selected {
      background-color: lightgray;
      transition: background-color 0.5s ease;
   }
   .uc-container > .title {
      box-shadow: 0 2px 5px rgba(0,0,0,.26);
      position: fixed;
      text-align: left;
      color: #fff;
      background-color: #ad1457;
      padding: 20px;
      font-size: 20px;
      font-weight: 600;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 2;
   }
</style>