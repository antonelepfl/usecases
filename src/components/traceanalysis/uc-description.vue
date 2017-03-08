<template>
   <div class="uc-description">
      <div class="title">
         <div class="title-text">{{ uc.title }}</div>
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
      }
   }
</script>

<style>
   .uc-description .title-text {
      font-size: 20px;
      font-weight: bold;

   }
</style>