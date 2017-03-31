<template>
  <div class="ta-form">
    <cb-form-component
      v-on:collabSelected="collabSelected"
      v-on:collabCreated="createNewCollab"
      :isLoading="isLoading">
    </cb-form-component>
  </div>
</template>

<script>
  import collabFormComponent from 'components/collab-form-component.vue'
  import createCollab from 'mixins/createCollab.js'
  export default {
    name: 'taForm',
    data () {
      return {
        isLoading: false,
        error: ''
      }
    },
    props: ['uc_name'],
    mixins: [createCollab], // use common functions
    components: {
      'cb-form-component': collabFormComponent
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

</style>
