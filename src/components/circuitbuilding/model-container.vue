<template>
   <div class="model-container">
      <uc-list-viewer :item-list="models" @selected="selected">
        <template v-slot:title>
          Please select a model
        </template>

        <template v-slot:default="slotProps">
          <model-item v-bind:model="slotProps.item"></model-item>
        </template>
      </uc-list-viewer>
   </div>
</template>

<script>
import ModelItem from './model-item.vue';
import UcListViewer from '@/components/uc-list-viewer.vue';
import circuitbuilding from '@/mixins/deepModel';
import modelsMixins from '@/mixins/models';
import { compactString } from '@/mixins/utils';

export default {
  name: 'modelContainer',
  components: {
    ModelItem,
    UcListViewer,
  },
  props: ['uc_name'],
  mixins: [circuitbuilding],
  data() {
    return {
      models: [],
      list_usecases: 'circuitbuilding',
    };
  },
  methods: {
    selected(model) {
      if (model.disabled) return;
      const pathName = compactString(model.title);
      this.$router.push({
        name: 'cb_form',
        params: { model_name: pathName },
      });
    },
  },
  created() {
    document.querySelector('title').innerHTML = 'Models';
    this.models = modelsMixins.getModelByUc(this.uc_name);
  },
};
</script>
