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
    };
  },
  components: {
    'collab-form-component': collabFormComponent,
  },
  props: ['folder_name', 'uc_name'],
  mixins: [createCollab], // use common functions
  methods: {
    collabSelected(collab) {
      this.createItems(collab, false);
    },
    createNewCollab(collab) {
      this.createItems(collab, false);
    },
    createItems(collab, isNewCollab) {
      this.errorMessage = '';
      this.isLoading = true;
      const findString = 'REPLACE_MORPHOLOGY_FILE_HERE';
      const replaceText = this.folder_name;
      this.sendStatistics(collab.id, this.uc_name, this.folder_name, isNewCollab);
      this.createItemInExistingCollabWithReplace(collab, this.uc_name, replaceText, findString)
        .catch((error) => {
          this.errorMessage = error.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>
