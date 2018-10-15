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
   import UcDescription from './uc-description.vue'
   import UcTags from './uc-tags.vue'
   import VideoTutorial from './video-tutorial.vue'

   export default {
      name: 'ucItem',
      components: {
         UcDescription,
         UcTags,
         VideoTutorial
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
