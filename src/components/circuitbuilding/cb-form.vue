<template>
  <div class="cb-form" v-if="authenticated">
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
  import circuitbuilding from './circuitbuilding.js'
  import collabAuthentication from 'mixins/collabAuthentication.js'
  export default {
    name: 'collabForm',
    data () {
      return {
        isLoading: false,
        error: '',
        authenticated: false
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
        let modelPrettyName = this.getModelName(this.model_name)
        this.sendStatistics(collab.id, this.uc_name, modelPrettyName, false)
        this.createItemInExistingCollab(collab, this.uc_name + this.model_name)
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
        let modelPrettyName = this.getModelName(this.model_name)
        this.sendStatistics(collab.id, this.uc_name, modelPrettyName, true)
        this.createItemInExistingCollab(collab, this.uc_name + this.model_name)
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
