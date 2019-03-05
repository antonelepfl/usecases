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
import collabAuthentication from '@/mixins/collabAuthentication';

const optimizationsBase = 'https://github.com/lbologna/bsp_data_repository/raw/master/optimizations';

export default {
  name: 'collabFormReplacing',
  data() {
    return {
      isLoading: false,
      errorMessage: '',
    };
  },
  components: {
    'collab-form-component': collabFormComponent,
  },
  props: ['folder_name', 'uc_name'],
  mixins: [createCollab, collabAuthentication], // use common functions
  methods: {
    collabSelected(collab) {
      const that = this;
      this.errorMessage = '';
      this.isLoading = true;
      const findString = 'REPLACE_MORPHOLOGY_FILE_HERE';
      const replaceText = `${optimizationsBase}/${this.folder_name}/${this.folder_name}.zip`;
      const category = this.$route.path.split('/')[1];
      this.sendStatistics(collab.id, this.uc_name, category, this.folder_name, false);
      this.createItemInExistingCollabWithReplace(collab, this.uc_name, replaceText, findString)
        .catch((error) => {
          that.errorMessage = error.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    createNewCollab(collab) {
      const that = this;
      this.errorMessage = '';
      this.isLoading = true;
      const findString = 'REPLACE_MORPHOLOGY_FILE_HERE';
      const replaceText = `${optimizationsBase}/${this.folder_name}/${this.folder_name}.zip`;
      const category = this.$route.path.split('/')[1];
      this.sendStatistics(collab.id, this.uc_name, category, this.folder_name, true);
      this.createItemInExistingCollabWithReplace(collab, this.uc_name, replaceText, findString)
        .catch((error) => {
          that.errorMessage = error.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>
