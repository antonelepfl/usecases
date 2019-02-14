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
      ucName: 'configureandrunasmallcircuitusingpreconfiguredhbpmodelanddata',
    };
  },
  mixins: [createCollab],
  methods: {
    touched(modelItem) { // open form or pair recording
      if (modelItem.externalLink) {
        window.open(modelItem.externalLink, '_blank');
        return;
      }

      this.$router.push({
        name: 'small_circuit_form',
        params: {
          folder_name: modelItem.modelName,
        },
      });
    },
  },
  created() {
    this.models = modelsMixins.getModelByUc(this.ucName);
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
