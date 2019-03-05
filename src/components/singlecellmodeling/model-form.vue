<template>
  <div class="model-form">
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
  props: ['uc_name', 'folder_name'],
  mixins: [createCollab, collabAuthentication], // use common functions
  methods: {
    collabSelected(collab) {
      this.errorMessage = '';
      this.isLoading = true;
      const findString = 'REPLACE_MODEL_HERE';
      const category = this.$route.path.split('/')[1];
      this.sendStatistics(collab.id, this.uc_name, category, this.folder_name, false);
      this.createItemInExistingCollabWithReplace(collab, this.uc_name, this.folder_name, findString)
        .catch((error) => {
          this.errorMessage = error.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    createNewCollab(collab) {
      this.errorMessage = '';
      this.isLoading = true;
      const findString = 'REPLACE_MODEL_HERE';
      const category = this.$route.path.split('/')[1];
      this.sendStatistics(collab.id, this.uc_name, category, this.folder_name, true);
      this.createItemInExistingCollabWithReplace(collab, this.uc_name, this.folder_name, findString)
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
