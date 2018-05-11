<template>
   <div class="uc-description">
      <div class="title small-margin">
         <div class="title-text">{{ uc.title }}</div>
      </div>
      <div class="description">
         <p>{{ uc.description }}</p>
      </div>
      <div class="contributors" v-if="uc.contributors">
        <b>Credits:</b>
        <div class="">
          Contributor(s):
          <span v-for="person in getContributorFormated(uc)" :key="person.name">
            <i>{{person}}</i>
          </span>
        </div>

      </div>
   </div>
</template>

<script>
   import { getContributorFormated } from '@/mixins/utils.js'
   export default {
      name: 'ucDescription',
      props: {
         uc: {
            type: Object
         }
      },
      data () {
        return {
          getContributorFormated,
        }
      },
   }
</script>

<style scoped>
   .uc-description .title-text {
      font-size: 20px;
      font-weight: bold;
   }
   .uc-description .title.small-margin {
      margin-bottom: 10px;
   }
</style>
