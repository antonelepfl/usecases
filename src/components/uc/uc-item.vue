<template>
   <div class="uc-item">
      <div class="item-picture">
         <img v-bind:src="uc.picture.src" v-bind:alt="uc.picture.alt">
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

<style scoped>
   .item-picture {
      width: 8%;
      min-height: 80px;
      min-width: 100px;
   }
   .uc-item {
      display: flex;
      align-items: center;
   }
   .uc-description {
      width: 72%;
      text-align: start;
      padding-left: 10px;
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
         width: 21%;
      }
      .uc-description {
         width: 71%;
      }
   }
   @media screen and (max-width: 450px) {
      .item-picture {
         display: none;
      }
      .uc-description {
         width: 79%;
      }
   }
</style>
