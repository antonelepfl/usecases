<template>
  <div class="collab-form-replacing">
    <collab-form-component v-on:collabSelected="collabSelected" v-on:collabCreated="createNewCollab" :isLoading="isLoading"></collab-form-component>
  </div>
</template>

<script>
  import createCollab from '../mixins/createCollab.js'
  import collabFormComponent from './collab-form-component.vue'
  export default {
    name: 'collabFormReplacing',
    data () {
      return {
        isLoading: false
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
        this.isLoading = true
        this.createItemInExistingCollabWithReplace(collab, this.model_name, this.folder_name)
        .then(function () {
          that.isLoading = false
        }, function (error) { that.errorMessage = error })
      },
      createNewCollab (collab) {
        var that = this
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

</style>
