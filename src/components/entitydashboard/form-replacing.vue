<template>
  <div class="morph-form-replacing">
    <collab-form-component
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
  import collabFormComponent from 'components/collab-form-component.vue'
  import mooc from 'mixins/mooc.js'
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
        if (this.replaceText === '') {
          throw Error('no replaceText was passed');
        }
      } catch (e) {
        console.error(e);
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
          'appid': 175,
          'extension': '.ipynb',
          'contenttype': 'x-ipynb+json',
          'initial': true,
          'file': this.uri
        }
        // from mooc with replace param
        let replaceObj = {'findString': this.findString, 'replaceText': this.replaceText};
        let navCreatedInfo = null;
        this.createItemInExistingCollab(collab, item, replaceObj)
        .then((elements) => {
          let newElem = elements[0]
          return that.createNavEntry(item.entryname, collab.id, newElem.parentId, item.appid, newElem.newFileId)
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
          that.isLoading = false
          that.error = error
        });
      }
    }
  }
</script>

<style scoped>
.error {
  color: red;
  text-align: center;
}
</style>
