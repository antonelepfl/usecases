<template>
  <div class="mooc-form">
    <h2>Reconstruction and simulation of neural tissue I: Neurons and Synapses</h2>
    <button type="button" @click="createNewCollab">Initialize Collab</button>
    <div v-show="isLoading" class="progress-bar">
      <md-progress class="md-accent" md-indeterminate></md-progress>
    </div>
    <div class="error">
      {{this.errorMessage}}
    </div>
  </div>
</template>

<script>
  import mooc from './mooc.js'
  import typesCollabsApps from 'assets/config_files/types_collabs_apps.json'

  export default {
    name: 'moocForm',
    data () {
      return {
        private: true,
        searchText: 'Mooc',
        isLoading: false,
        errorMessage: ''
      }
    },
    props: ['uc_name'],
    mixins: [mooc], // use common functions
    mounted () {
      if (typesCollabsApps[this.uc_name] === undefined) {
        this.errorMessage = 'No defined application for ' + this.uc_name + ' in typesCollabsApps.json'
      }
    },
    methods: {
      createNewCollab () {
        var that = this
        var isPrivate = true
        this.isLoading = true
        this.errorMessage = ''
        let name = this.searchText
        this.createMoocCollab(isPrivate, name, this.uc_name)
        .then(function () {
          that.isLoading = false
        },
        function (error) {
          if (error === 'collab with this title already exists.') {
            console.debug('Collab name already exist')
            that.errorMessage = 'Please try again'
            that.isLoading = false
          } else {
            that.errorMessage = error
            that.isLoading = false
          }
        })
      }
    }
  }
</script>

<style scoped>
  .error {
    color: red;
  }
  .mooc-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
  }
  .progress-bar {
    margin-top: 20px;
    width: 40%;
  }
</style>
