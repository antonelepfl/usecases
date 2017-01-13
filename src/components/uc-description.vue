<template>
   <div class="uc-description">
      <div class="title">
         <h2 class="title-text">{{ uc.title }}</h2>
      </div>
      <div class="description">
         <p>{{ uc.description }}</p>
      </div>
   </div>
</template>

<script>
   export default {
      name: 'ucDescription',
      props: {
         uc: {
            type: Object
         }
      },
      components: {
      }
   }
</script>

<style>
</style>