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
  import createCollab from '@/mixins/createCollab.js'
  import collabFormComponent from '@/components/collab-form-component.vue'
  import collabAuthentication from '@/mixins/collabAuthentication.js'
  export default {
    name: 'collabFormReplacing',
    data () {
      return {
        isLoading: false,
        error: '',
        findString: 'REPLACE_STRIATAL_MODEL_HERE',
        replaceText: this.folder_name,
        uc_name: 'optimizeastriatalfast-spikinginterneuron'
      }
    },
    components: {
      'collab-form-component': collabFormComponent
    },
    props: ['folder_name'],
    mixins: [createCollab, collabAuthentication], // use common functions
    methods: {
      collabSelected: function (collab) {
        var that = this
        this.error = ''
        this.isLoading = true
        var category = this.$route.path.split('/')[1]
        this.createItemInExistingCollabWithReplace(collab, this.uc_name, this.replaceText, this.findString)
        .then(function () {
          that.isLoading = false
        }, function (error) {
          that.isLoading = false
          that.error = error
        })
        this.sendStatistics(collab.id, this.uc_name, category, this.folder_name, false);
      },
      createNewCollab (collab) {
        var that = this
        this.error = ''
        this.isLoading = true
        var category = this.$route.path.split('/')[1]
        this.createItemInExistingCollabWithReplace(collab, this.uc_name, this.replaceText, this.findString)
        .then(function () {
          that.isLoading = false
        })
        this.sendStatistics(collab.id, this.uc_name, category, this.folder_name, true);
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
