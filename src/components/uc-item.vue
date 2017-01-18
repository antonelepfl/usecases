<template>
   <div class="uc-item">
      <div class="item-picture">
         <!--<img v-bind:src="uc.picture.src" v-bind:alt="uc.picture.alt">-->
         <img src="../assets/cac.png" v-bind:alt="uc.picture.alt">
      </div>
      <uc-description class="uc-description" v-bind:uc="uc"></uc-description>
      <uc-tags class="tags" v-bind:uc="uc" v-bind:categories="categories"></uc-tags>
   </div>
</template>

<script>
   import ucDescription from './uc-description.vue'
   import ucTags from './uc-tags.vue'
   export default {
      name: 'ucItem',
      components: {
         ucDescription, ucTags
      },
      props: {
         uc: {
            type: Object
         },
         categories: {
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
      align-items: center;
   }
   .uc-description {
      width: 80%;
      text-align: start;
      padding-left: 5%;

   }
   .tags {
      width: 20%;
      padding: 10px 0px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-wrap: wrap;
   }
   @media screen and (min-width: 851px) and (max-width: 1200px) {
      .tags {
         width: 25%;
      }
      .uc-description {
         width: 75%;
      }
   }
</style>