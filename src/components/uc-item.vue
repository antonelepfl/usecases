<template>
   <div class="uc-item">
      <div class="item-picture">
         <img v-bind:src="uc.picture.src" v-bind:alt="uc.picture.alt">
      </div>
      <uc-description class="uc-description" v-bind:uc="uc"></uc-description>
   </div>
</template>

<script>
   import ucDescription from './uc-description.vue'
   export default {
      name: 'ucItem',
      components: {
         ucDescription
      },
      props: {
         uc: {
            type: Object
         }
      }
   }
   
</script>

<style>
   .item-picture {
      max-width: 100px;
   }
   .uc-item {
      display: flex;
   }
   .uc-description {
      width: 100%;
   }
</style>