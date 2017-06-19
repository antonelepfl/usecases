<template>
  <div class="ta-form" v-if="authenticated">
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
  import collabAuthentication from 'mixins/collabAuthentication.js'
  export default {
    name: 'taForm',
    data () {
      return {
        isLoading: false,
        error: '',
        authenticated: false
      }
    },
    props: ['uc_name'],
    mixins: [createCollab, collabAuthentication], // use common functions
    components: {
      'cb-form-component': collabFormComponent
    },
    methods: {
      collabSelected: function (collab) {
        var that = this
        this.isLoading = true
        this.error = ''
        this.sendStatistics(collab.id, this.uc_name, null, false)
        this.createItemInExistingCollab(collab, this.uc_name)
        .then(function () {
          that.isLoading = false
        }, function (error) {
          that.isLoading = false
          that.error = error
        })
      },
      createNewCollab (collab) {
        var that = this
        this.isLoading = true
        this.error = ''
        this.sendStatistics(collab.id, this.uc_name, null, true)
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
