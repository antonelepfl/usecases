<template>
  <div class="collab-form">
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
  import collabFormComponent from './collab-form-component.vue'
  import createCollab from '../mixins/createCollab.js'
  import typesCollabsApps from 'assets/config_files/types_collabs_apps.json'
  export default {
    name: 'collabForm',
    data () {
      return {
        isLoading: false,
        error: ''
      }
    },
    props: ['uc_name'],
    mixins: [createCollab], // use common functions
    components: {
      'collab-form-component': collabFormComponent
    },
    mounted () {
      if (!typesCollabsApps[this.uc_name]) {
        this.error = 'No file defined in typesCollabsApps.json'
      }
    },
    methods: {
      collabSelected: function (collab) {
        var that = this
        this.isLoading = true
        this.createItemInExistingCollab(collab, this.uc_name)
        .then(function () {
          that.isLoading = false
        }, function (error) { that.errorMessage = error })
      },
      createNewCollab (collab) {
        var that = this
        this.isLoading = true
        this.createItemInExistingCollab(collab, this.uc_name)
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
