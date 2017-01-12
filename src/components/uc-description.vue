<template>
   <div class="uc-description">
      <div class="title">
         <h4 class="title-text">{{ uc.title }}</h4>
         <uc-tags class="tags" v-bind:uc="uc"></uc-tags>
      </div>
      <div class="description">
         <p>{{ uc.description }}</p>
      </div>
   </div>
</template>

<script>
   import ucTags from './uc-tags.vue'
   export default {
      name: 'ucDescription',
      props: {
         uc: {
            type: Object
         }
      },
      components: {
         ucTags
      }
   }
</script>

<style>
.title {
}
.title-text {
}
.tags {
   float: right;
}
</style>