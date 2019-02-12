<template>
   <div class="model-container">
      <div class="title-uc">Please select a model</div>
      <div class="content-uc">
        <div
          v-for="model in models"
          :key="model.title"
          :class="{ 'disabled-container': model.disabled }"
          @click="selected(model)"
        >
        <div v-if="model.disabled" class="disabled-tag">Coming Soon</div>
          <md-whiteframe
            md-elevation="2"
            class="item-sections"
            v-bind:class="{ 'disabled-item': model.disabled }"
          >
            <model-item v-bind:model="model"></model-item>
          </md-whiteframe>
        </div>
      </div>
   </div>
</template>

<script>
import modelItem from './model-item.vue';
import CollabAuthentication from '@/mixins/collabAuthentication';
import circuitbuilding from '@/mixins/deepModel';
import modelsMixins from '@/mixins/models';

export default {
  name: 'modelContainer',
  components: {
    'model-item': modelItem,
  },
  props: ['uc_name'],
  mixins: [CollabAuthentication, circuitbuilding],
  data() {
    return {
      models: [],
      list_usecases: 'circuitbuilding',
    };
  },
  methods: {
    selected(model) {
      if (!model.disabled) {
        const pathName = this.uglyfy(model.title);
        this.$router.push({
          name: 'cb_form',
          params: { model_name: pathName },
        });
      }
    },
  },
  created() {
    document.querySelector('title').innerHTML = 'Models';
    this.models = modelsMixins.getModelByUc(this.uc_name);
  },
};
</script>
