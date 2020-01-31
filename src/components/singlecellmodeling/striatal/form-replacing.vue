<template>
  <div class="morph-form-replacing">
    <collab-form-component
      v-on:collabSelected="collabSelected"
      v-on:collabCreated="createNewCollab"
      :isLoading="isLoading">
    </collab-form-component>
    <div class="error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import createCollab from '@/mixins/createCollab';
import collabFormComponent from '@/components/collab-form-component.vue';

export default {
  name: 'collabFormReplacing',
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      findString: 'REPLACE_STRIATAL_MODEL_HERE',
      replaceText: this.folder_name,
      uc_name: 'optimizeastriatalfast-spikinginterneuron',
    };
  },
  components: {
    'collab-form-component': collabFormComponent,
  },
  props: ['folder_name'],
  mixins: [createCollab], // use common functions
  methods: {
    collabSelected(collab) {
      const that = this;
      this.errorMessage = '';
      this.isLoading = true;
      this.createItemInExistingCollabWithReplace(collab, this.uc_name, this.replaceText, this.findString)
        .catch((error) => {
          that.errorMessage = error.message;
        })
        .finally(() => {
          that.isLoading = false;
        });
      this.sendStatistics(collab.id, this.uc_name, this.folder_name, false);
    },
    createNewCollab(collab) {
      const that = this;
      this.errorMessage = '';
      this.isLoading = true;
      this.createItemInExistingCollabWithReplace(collab, this.uc_name, this.replaceText, this.findString)
        .catch((error) => {
          that.errorMessage = error.message;
        })
        .finally(() => {
          that.isLoading = false;
        });
      this.sendStatistics(collab.id, this.uc_name, this.folder_name, true);
    },
  },
};
</script>
