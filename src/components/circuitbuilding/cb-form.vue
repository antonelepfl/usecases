<template>
  <div class="cb-form">
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
    name: 'collabForm',
    data () {
      return {
        isLoading: false,
        error: ''
      }
    },
    props: ['model_name'],
    mixins: [createCollab], // use common functions
    components: {
      'cb-form-component': collabFormComponent
    },
    methods: {
      collabSelected: function (collab) {
        var that = this
        this.isLoading = true
        this.createItemInExistingCollab(collab, this.model_name)
        .then(function () {
          that.isLoading = false
        }, function (error) { that.errorMessage = error })
      },
      createNewCollab (collab) {
        var that = this
        this.isLoading = true
        this.createItemInExistingCollab(collab, this.model_name)
        .then(function () {
          that.isLoading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
