<template>
  <div class="morph-form-replacing">
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
  export default {
    name: 'collabFormReplacing',
    data () {
      return {
        isLoading: false,
        error: ''
      }
    },
    components: {
      'collab-form-component': collabFormComponent
    },
    props: ['model_name', 'folder_name'],
    mixins: [createCollab], // use common functions
    methods: {
      collabSelected: function (collab) {
        var that = this
        this.error = ''
        this.isLoading = true
        var findString = 'REPLACE_MORPHOLOGY_FILE_HERE'
        this.createItemInExistingCollabWithReplace(collab, this.model_name, this.folder_name, findString)
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
        this.createItemInExistingCollabWithReplace(collab, this.model_name, this.folder_name)
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
