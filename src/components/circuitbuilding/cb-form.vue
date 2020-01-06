<template>
  <div class="cb-form">
    <cb-form-component
      v-on:collabSelected="collabSelected"
      v-on:collabCreated="createNewCollab"
      :isLoading="isLoading">
    </cb-form-component>
    <div class="error">
      {{error}}
    </div>
  </div>
</template>

<script>
import collabFormComponent from '@/components/collab-form-component.vue';
import createCollab from '@/mixins/createCollab';
import circuitbuilding from '@/mixins/deepModel';

export default {
  name: 'collabForm',
  data() {
    return {
      isLoading: false,
      error: '',
    };
  },
  props: ['uc_name', 'model_name'],
  mixins: [createCollab, circuitbuilding], // use common functions
  components: {
    'cb-form-component': collabFormComponent,
  },
  methods: {
    collabSelected(collab) {
      const that = this;
      this.isLoading = true;
      this.error = '';
      const modelPrettyName = this.getModelName(this.model_name);
      this.sendStatistics(collab.id, this.uc_name, modelPrettyName, false);
      this.createItemInExistingCollabDeepModel(collab, this.uc_name, this.model_name)
        // some of the functions here are overwritten in the circuitbuilding.js
        .then(() => {
          that.isLoading = false;
        }, (error) => {
          that.isLoading = false;
          that.error = error;
        });
    },
    createNewCollab(collab) {
      const that = this;
      this.error = '';
      this.isLoading = true;
      const modelPrettyName = this.getModelName(this.model_name);
      this.sendStatistics(collab.id, this.uc_name, modelPrettyName, true);
      this.createItemInExistingCollabDeepModel(collab, this.uc_name, this.model_name)
        .then(() => {
          that.isLoading = false;
        });
    },
  },
};
</script>
