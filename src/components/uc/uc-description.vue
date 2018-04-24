<template>
   <div class="uc-description">
      <div class="title">
         <div class="title-text">{{ uc.title }}</div>
      </div>
      <div class="description">
         <p>{{ uc.description }}</p>
      </div>
      <div class="contributors" v-if="uc.contributors">
        <b>Credits:</b>
        <div class="">
          Contributor(s): <span v-for="person in uc.contributors" :key="person.name"> <i>{{person.name}}</i> - {{person.email}}. </span>
        </div>

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

<style scoped>
   .uc-description .title-text {
      font-size: 20px;
      font-weight: bold;
   }
</style>
