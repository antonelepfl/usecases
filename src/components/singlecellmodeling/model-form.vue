<template>
  <div class="model-form" v-if="authenticated">
    <collab-form-component
      v-on:collabSelected="collabSelected"
      v-on:collabCreated="createNewCollab"
      :isLoading="isLoading">
    </collab-form-component>
    <div class="error">
      {{error}}
    </div>
  </div>
</template>

<script>
  import createCollab from 'mixins/createCollab.js'
  import collabFormComponent from 'components/collab-form-component.vue'
  import collabAuthentication from 'mixins/collabAuthentication.js'
  export default {
    name: 'collabFormReplacing',
    data () {
      return {
        isLoading: false,
        error: '',
        authenticated: false
      }
    },
    components: {
      'collab-form-component': collabFormComponent
    },
    props: ['uc_name', 'folder_name'],
    mixins: [createCollab, collabAuthentication], // use common functions
    methods: {
      collabSelected: function (collab) {
        var that = this
        this.error = ''
        this.isLoading = true
        var findString = 'REPLACE_MODEL_HERE'
        this.sendStatistics(collab.id, this.uc_name, false)
        this.createItemInExistingCollabWithReplace(collab, this.uc_name, this.folder_name, findString)
        .then(function () {
          that.isLoading = false
        }, function (error) {
          that.isLoading = false
          that.error = error
        })
      },
      createNewCollab (collab) {
        var that = this
        this.error = ''
        this.isLoading = true
        var findString = 'REPLACE_MODEL_HERE'
        this.sendStatistics(collab.id, this.uc_name, true)
        this.createItemInExistingCollabWithReplace(collab, this.uc_name, this.folder_name, findString)
        .then(function () {
          that.isLoading = false
        })
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
