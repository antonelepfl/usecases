<template>
  <div class="ardock-iframe">
    <iframe src='https://ardock.ibcp.fr'></iframe>
  </div>
</template>

<script>
import collabFormComponent from '@/components/collab-form-component.vue';
import createCollab from '@/mixins/createCollab';
import collabAuthentication from '@/mixins/collabAuthentication';

export default {
  name: 'ArdockFrame',
  data() {
    return {
      isLoading: false,
      errorMessage: '',
    };
  },
  props: ['uc_name'],
  mixins: [createCollab, collabAuthentication], // use common functions
  components: {
    'cb-form-component': collabFormComponent,
  },
  methods: {
    collabSelected(collab) {
      const that = this;
      this.isLoading = true;
      this.errorMessage = '';
      const category = this.$route.path.split('/')[1];
      this.sendStatistics(collab.id, this.uc_name, category, null, false);
      this.createItemInExistingCollab(collab, this.uc_name)
        .catch((error) => {
          that.errorMessage = error.message;
        })
        .finally(() => {
          that.isLoading = false;
        });
    },
    createNewCollab(collab) {
      const that = this;
      this.isLoading = true;
      this.errorMessage = '';
      const category = this.$route.path.split('/')[1];
      this.sendStatistics(collab.id, this.uc_name, category, null, true);
      this.createItemInExistingCollab(collab, this.uc_name)
        .catch((error) => {
          that.errorMessage = error.message;
        })
        .finally(() => { that.isLoading = false; });
    },
  },
};
</script>
