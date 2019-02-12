<template>
  <div class="morph-form-replacing">
    <collab-form-component
      class="custom-theme"
      @collabSelected="collabSelected"
      @collabCreated="createNewCollab"
      :isLoading="isLoading">
    </collab-form-component>
    <div class="error">
      {{errorMessage}}
    </div>
  </div>
</template>

<script>
import collabFormComponent from '@/components/collab-form-component.vue';
import mooc from '@/mixins/mooc';
import store from '@/mixins/store';

const traceAnalysisTemplate = 'https://raw.githubusercontent.com/antonelepfl/testvue/master/notebooks/test_replace.ipynb';

export default {
  name: 'entityFormReplacing',
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      findString: null,
      replaceText: null,
      uri: null,
    };
  },
  components: {
    'collab-form-component': collabFormComponent,
  },
  mixins: [mooc],
  props: ['json_params'],
  mounted() {
    const parsed = this.$route.query;
    this.findString = parsed.txtToReplace || 'REPLACE_UUID';
    this.replaceText = parsed.replaceText || '';
    this.uri = parsed.uri || traceAnalysisTemplate;
    this.name = parsed.name || 'Trace_Analysis_Nexus';
    this.appId = parsed.appId || '175';
    if (this.replaceText === '') {
      this.errorMessage = 'No replaceText was passed as argument';
    }
  },
  methods: {
    async collabSelected(collab) {
      try {
        await this.createItem(collab);
      } catch (error) {
        this.errorMessage = error.message;
      }
      this.isLoading = false;
    },
    async createNewCollab(collab) {
      try {
        await this.createItem(collab);
      } catch (error) {
        this.errorMessage = error.message;
      }
      this.isLoading = false;
    },
    async createItem(collab) {
      this.errorMessage = '';
      this.isLoading = true;
      const item = {
        entryname: this.name,
        appid: this.appId,
        extension: '.ipynb',
        contenttype: 'x-ipynb+json',
        initial: true,
        file: this.uri,
      };
      // from mooc with replace param
      const replaceObj = { findString: this.findString, replaceText: this.replaceText };
      let navPromise = null;
      if (Object.keys(store.state.allNavItems).length === 0) {
        navPromise = this.getAllNav(collab.id);
      } else {
        navPromise = Promise.resolve(store.state.allNavItems);
      }
      const parentNav = await navPromise;
      const isReplace = await this.replaceExistsDialog(parentNav, item);
      if (!isReplace) { // no replace. generate new navitem and new file
        this.abortAndRedirect(collab, { files: [item] });
        return;
      }

      const element = await this.createItemInExistingCollab(collab, item, replaceObj);

      // using Mooc createNavEntry
      const navInfo = await this.createNavEntry({
        entryName: item.entryname,
        collabId: collab.id,
        parentId: element.parentId,
        appId: item.appid,
        fileId: element.newFileId,
      });

      await this.fillJupyterNavItem(navInfo.fileId, navInfo.navitemId, navInfo.collabId, navInfo.context);

      if (navInfo.collabId) {
        this.redirectToCollab(navInfo.collabId, navInfo.navitemId);
      }
    },
  },
};
</script>

<style>
.collab-form-component.custom-theme .header,
.collab-form-component.custom-theme .tabs .custom-tabs a,
.collab-form-component.custom-theme .md-theme-default.md-button:not([disabled]).md-primary.md-raised.button-medium {
  background-color: #1e8bc3;
  border-color: transparent;
}
.collab-form-component.custom-theme .tabs .custom-tabs .is-active a {
  background-color: #176c98;
  border-color: transparent;
}
</style>
