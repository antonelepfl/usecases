<template>
  <div class="morph-form-replacing">
    <collab-form-component
      class="custom-theme"
      @collabSelected="collabSelected"
      @collabCreated="createNewCollab"
      :isLoading="isLoading">
    </collab-form-component>
    <div class="error">
      {{error}}
    </div>
  </div>
</template>

<script>
  import collabFormComponent from '@/components/collab-form-component.vue'
  import mooc from '@/mixins/mooc.js'
  import store from '@/mixins/store.js'
  const traceAnalysisTemplate = 'https://raw.githubusercontent.com/antonelepfl/testvue/master/notebooks/test_replace.ipynb'

  export default {
    name: 'entityFormReplacing',
    data () {
      return {
        isLoading: false,
        error: '',
        findString: null,
        replaceText: null,
        uri: null
      }
    },
    components: {
      'collab-form-component': collabFormComponent
    },
    mixins: [mooc],
    props: ['json_params'],
    mounted () {
      try {
        let parsed = this.$route.query;
        this.findString = parsed.txtToReplace || 'REPLACE_UUID';
        this.replaceText = parsed.replaceText || '';
        this.uri = parsed.uri || traceAnalysisTemplate;
        this.name = parsed.name || 'Trace_Analysis_Nexus';
        this.appId = parsed.appId || '175';
        if (this.replaceText === '') {
          throw Error('no replaceText was passed');
        }
      } catch (e) {
        throw Error('decoding entity param');
      }
    },
    methods: {
      collabSelected: function (collab) {
        // this.sendStatistics(collab.id, this.uc_name, category, this.folder_name, false);
        this.createItem(collab);
      },
      createNewCollab (collab) {
        // this.sendStatistics(collab.id, this.uc_name, category, this.folder_name, true);
        this.createItem(collab);
      },
      createItem (collab) {
        var that = this
        this.error = ''
        this.isLoading = true
        let item = {
          'entryname': that.name,
          'appid': that.appId,
          'extension': '.ipynb',
          'contenttype': 'x-ipynb+json',
          'initial': true,
          'file': this.uri
        }
        // from mooc with replace param
        let replaceObj = {'findString': this.findString, 'replaceText': this.replaceText}
        let navCreatedInfo = null
        let parentNav = null
        let navPromise = null
        if (Object.keys(store.state.allNavItems).length === 0) {
          navPromise = that.getAllNav(collab.id)
        } else {
          navPromise = Promise.resolve(store.state.allNavItems)
        }
        navPromise.then((navs) => { parentNav = navs })
        .then(() => {
          return that.replaceExistsDialog(parentNav, item)
        })
        .then((isReplace) => {
          if (!isReplace) { // no replace. generate new navitem and new file
            throw String('abort and redirect')
          }
          return this.createItemInExistingCollab(collab, item, replaceObj)
        })
        .then((element) => {
          // using Mooc createNavEntry
          return that.createNavEntry({
            'entryName': item.entryname,
            'collabId': collab.id,
            'parentId': element.parentId,
            'appId': item.appid,
            'fileId': element.newFileId
          })
        })
        .then((navInfo) => {
          navCreatedInfo = navInfo;
          return that.fillJupyterNavItem(navInfo.fileId, navInfo.navitemId, navInfo.collabId, navInfo.context)
        })
        .then(() => {
          if (navCreatedInfo.collabId) {
            that.redirectToCollab(navCreatedInfo.collabId, navCreatedInfo.navitemId)
          }
          that.isLoading = false
        })
        .catch((error) => {
          let fileSearch = {'files': [item]}
          that.abortAndRedirect(collab, fileSearch, error)
        })
      }
    }
  }
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
