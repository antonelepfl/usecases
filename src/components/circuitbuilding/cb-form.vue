<template>
  <div class="cb-form">
    <cb-form-component
      v-on:collabSelected="collabSelected"
      v-on:collabCreated="createNewCollab"
      :isLoading="isLoading">
    </cb-form-component>
    <div class="error">
      {{error}}
    </div>
  </div>
</template>

<script>
  import collabFormComponent from 'components/collab-form-component.vue'
  import createCollab from 'mixins/createCollab.js'
  import circuitbuilding from 'mixins/circuitbuilding.js'
  import collabAuthentication from 'mixins/collabAuthentication.js'
  export default {
    name: 'collabForm',
    data () {
      return {
        isLoading: false,
        error: ''
      }
    },
    props: ['uc_name', 'model_name'],
    mixins: [createCollab, circuitbuilding, collabAuthentication], // use common functions
    components: {
      'cb-form-component': collabFormComponent
    },
    methods: {
      collabSelected: function (collab) {
        var that = this
        this.isLoading = true
        this.error = ''
        var modelPrettyName = this.getModelName(this.model_name)
        var category = this.$route.path.split('/')[1]
        this.sendStatistics(collab.id, this.uc_name, category, modelPrettyName, false)
        this.createItemInExistingCollabCircuitBuilding(collab, this.uc_name, this.model_name)
        // some of the functions here are overwritten in the circuitbuilding.js
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
        var modelPrettyName = this.getModelName(this.model_name)
        var category = this.$route.path.split('/')[1]
        this.sendStatistics(collab.id, this.uc_name, category, modelPrettyName, true)
        this.createItemInExistingCollabCircuitBuilding(collab, this.uc_name, this.model_name)
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
