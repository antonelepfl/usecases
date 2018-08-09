<template>
   <div class="uc-item">
      <div class="item-picture">
         <img v-bind:src="uc.picture.src" v-bind:alt="uc.picture.alt">
      </div>
      <uc-description class="uc-description" v-bind:uc="uc"></uc-description>
      <uc-tags class="tags" v-bind:uc="uc" v-bind:categories="categories"></uc-tags>
      <video-tutorial :uc="uc"/>
   </div>
</template>

<script>
   import ucDescription from './uc-description.vue'
   import ucTags from './uc-tags.vue'
   import videoTutorial from './video-tutorial.vue'

   export default {
      name: 'ucItem',
      components: {
         ucDescription, ucTags, videoTutorial
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
