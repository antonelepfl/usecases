<template>
   <div class="single-cell-insilico-experiments">
    <div class="title-uc">Please select a model</div>
    <div class="content-uc">
      <models-list
        :models="models"
        v-on:selected="touched">
      </models-list>
    </div>
   </div>
</template>

<script>
import modelList from '@/components/singlecellmodeling/striatal/striatal-list.vue';
import createCollab from '@/mixins/createCollab';
import modelsMixins from '@/mixins/models';

export default {
  props: ['uc_name'],
  name: 'modelContainer',
  components: {
    'models-list': modelList,
  },
  data() {
    return {
      models: [],
    };
  },
  mixins: [createCollab],
  methods: {
    touched(modelItem) { // open form or pair recording
      if (modelItem.externalLink) {
        this.sendStatistics(null, this.uc_name, modelItem.title, null);
        window.open(modelItem.externalLink, '_blank');
      }
    },
  },
  created() {
    this.models = modelsMixins.getModelByUc(this.$route.params.uc_name);
    document.querySelector('title').innerHTML = 'Small Circuits In Silico Experiments';
  },
};
</script>

<style>
  .disabled-model {
    opacity: .5;
    background-color: rgba(63,58,58,.22);
    cursor: not-allowed;
  }
</style>
