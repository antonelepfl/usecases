<template>
   <div class="model-item">
      <div class="item-picture">
         <img v-bind:src="model.img" alt="">
      </div>
      <uc-description class="uc-description" v-bind:uc="uc"></uc-description>
   </div>
</template>

<script>
import UcDescription from '@/components/uc/uc-description.vue';

export default {
  name: 'modelItem',
  components: {
    UcDescription,
  },
  data() {
    return {
      uc: {},
    };
  },
  props: {
    model: {
      type: Object,
    },
  },
  created() {
    // converting to reuse the uc description
    this.uc.title = this.model.title;
    this.uc.description = this.model.description;
    this.uc.contributors = this.model.contributors;
  },
};
</script>
