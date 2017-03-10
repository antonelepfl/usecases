<template>
   <div class="model-item">
      <div class="item-picture">
         <img v-bind:src="model.img" alt="">
      </div>
      <uc-description class="uc-description" v-bind:uc="uc"></uc-description>
   </div>
</template>

<script>
   import ucDescription from '../traceanalysis/uc-description.vue'
   export default {
      name: 'modelItem',
      components: {
         'uc-description': ucDescription
      },
      data () {
        return {
          uc: {}
        }
      },
      props: {
         model: {
            type: Object
         }
      },
      created () {
        // converting to reuse the uc description
        this.uc.title = this.model.species + ' ' + this.model.brain_structure + ' ' + this.model.cell_soma_location
        this.uc.description = this.model.description
        this.uc.contributors = this.model.contributors
      }
   }

</script>

<style scoped>
   .item-picture {
      width: 18%;
      min-height: 80px;
      margin-right: 3%;
   }
   .uc-item {
      display: flex;
      align-items: center;
   }
   .uc-description {
      width: 85%;
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
   .model-item {
     display: flex;
     align-items: center;
   }
   @media screen and (min-width: 851px) and (max-width: 1200px) {
      .tags {
         width: 21%;
      }
      .uc-description {
         width: 71%;
      }
   }
   @media screen and (max-width: 750px) {
      .item-picture {
         display: none;
      }
      .uc-description {
         width: 79%;
      }
   }
</style>
