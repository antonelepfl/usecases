<template>
   <div class="model-container">
      <uc-list-viewer :item-list="models" @selected="selected">

        <template v-slot:title>Please select a model</template>

        <template v-slot:default="slotProps">
          <model-item v-bind:model="slotProps.item"/>
        </template>

      </uc-list-viewer>
   </div>
</template>

<script>
import ModelItem from './model-item.vue';
import UcListViewer from '@/components/uc-list-viewer.vue';
import modelsMixins from '@/mixins/models';
import createCollab from '@/mixins/createCollab';
import { compactString } from '@/mixins/utils';

export default {
  name: 'ModelContainer',
  components: {
    ModelItem,
    UcListViewer,
  },
  props: ['uc_name'],
  data() {
    return {
      models: [],
      list_usecases: 'brainareacircuitinsilicoexperiments',
    };
  },
  mixins: [createCollab],
  methods: {
    selected(model) {
      if (model.disabled) return;
      if (model.files) {
        this.$router.push({
          name: 'brainarea_form',
          params: {
            model_name: compactString(model.title),
          },
        });
      } else {
        this.sendStatistics(null, this.uc_name, model.title, null);
        window.open(model.redirect_url, '_blank');
      }
    },
  },
  created() {
    document.querySelector('title').innerHTML = 'Models';
    this.models = modelsMixins.getModelByUc(this.uc_name);
  },
};
</script>
