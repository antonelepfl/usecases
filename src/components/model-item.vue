<template>
   <div class="model-item">
      <div class="path" v-on:click="touched">
         <div class="inline" v-for="(part, index) in pathParts">
            <span class="square">{{ part }}</span> 
            <span v-show="hasNext(index)"> > </span>
         </div>
      </div>
      <div class="section">
         <md-layout md-gutter>
            <md-layout class="model-item-picture"  md-flex-large="40" md-flex-medium="20" md-hide-xsmall>
               <md-layout md-column md-flex-large="50" md-flex-medium="100">
                  <img src="../assets/traces.png" v-on:click="showImage">
               </md-layout>

               <md-layout md-column md-flex-large="50" md-flex-medium="100">
                  <img src="../assets/morphology.png" v-on:click="showImage">
               </md-layout>
            </md-layout>

            <md-layout md-column  md-flex-large="60" md-flex-medium="80" md-flex-xsmall="100">
               <model-description class="model-description" v-bind:author="author" v-on:touched="touched"></model-description>
            </md-layout>
         </md-layout>
      </div>
   </div>
</template>

<script>
   import modelDescription from './model-description.vue'
   
   export default {
      name: 'modelItem',
      components: {
         modelDescription
      },
      props: {
         path: String,
         author: String
      },
      data () {
         return {
            pathParts: []
         }
      },
      methods: {
         showImage (event) {
            this.$emit('showimage', {'src': event.target.src, 'path': this.path})
         },
         hasNext (index) {
            return index < (this.pathParts.length - 1)
         },
         touched (event) {
            var el = event.currentTarget
            var found = true
            while (el.parentNode && found) {
               el = el.parentNode
               if (el.className.indexOf('model-item') > -1) {
                  this.$emit('touched', el) // return the root component
                  found = false
               }
            }
         }
      },
      mounted () {
         this.pathParts = this.path.split('>')
      }
   }
   
</script>

<style>
   .model-item-picture {
      align-items: center;
   }
   .path {
      background-color: rgba(130, 180, 195, 0.38);
      font-size: 20px;
      padding: 5px;
      text-shadow: 2px 2px rgba(120, 130, 253, 0.13);
      text-align: left;
   }
   .inline {
      padding: 4px;
      display: inline-block;
   }
   .inline span {
      padding-left: 4px;
      padding-right: 2px;
   }
   .square:hover {
      background-color: rgba(103, 103, 122, 0.35);
      border-radius: 5px;
   }

   @media screen and (min-width: 851px) and (max-width: 1200px) {
   }
</style>