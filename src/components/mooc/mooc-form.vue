<template>
  <div class="mooc-form">
    <h2>Reconstruction and simulation of neural tissue I: Neurons and Synapses</h2>

    <md-whiteframe md-tag="section" class="body-mooc">
      <b>SEARCH</b>
      <md-input-container>
        <label>Collab Name</label>
        <md-input placeholder="Search in your collabs" v-model.lazy="searchText"></md-input>
      </md-input-container>
      <div v-show="!isLoadingLocal" class="collabs-results-container">
        <div v-for="collab in collabResults" class="collab-result" >
          <a class="nota" @click="collabSelected(collab)">{{ collab.title }}</a>
        </div>
      </div>
      <div v-show="isLoadingLocal" class="progress-bar">
        <md-progress class="md-accent" md-indeterminate></md-progress>
      </div>

      <b class="or">OR CREATE</b>
      <md-button class="md-raised" @click="createNewCollab">Initialize Collab</md-button>
      <div v-show="isLoading" class="progress-bar">
        <md-progress class="md-accent" md-indeterminate></md-progress>
      </div>
      <div class="error">
        {{errorMessage}}
      </div>
    </md-whiteframe>
  </div>
</template>

<script>
  import mooc from './mooc.js'
  export default {
    name: 'moocForm',
    data () {
      return {
        private: true,
        searchText: '',
        isLoading: false,
        errorMessage: '',
        isLoadingLocal: false,
        collabResults: []
      }
    },
    props: ['uc_name'],
    mixins: [mooc], // use common functions
    methods: {
      createNewCollab () {
        var that = this
        var isPrivate = true
        this.isLoading = true
        this.errorMessage = ''
        let name = 'Mooc ' + this.searchText
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
            that.isLoading = false
          }
        })
      },
      collabSelected (collab) {
        var that = this
        this.addMoocExistingCollab(collab, this.uc_name).then(function () {
          that.isLoading = false
        }, function (error) {
          that.errorMessage = error
          that.isLoading = false
        })
      }
    },
    watch: {
      'searchText' (newVal) {
        var that = this
        this.isLoadingLocal = true
        if (newVal === '') {
          that.collabResults = []
          that.errorMessage = ''
          that.isLoadingLocal = false
          return;
        }
        this.searchCollab(newVal).then(function (result) {
          if (that.errorMessage !== '') {
            that.errorMessage = ''
          }
          if (result.length === 0) {
            that.collabResults = [{'title': 'No found'}]
          } else {
            that.collabResults = result
          }
          that.isLoadingLocal = false
        }, function (reject) {
          that.errorMessage = 'Getting your collabs ...'
        })
      }
    }
  }
</script>

<style scoped>
  .body-mooc {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 50px auto 0 auto;
    max-width: 500px;
    padding: 10px;
    background-color: rgba(214, 233, 250, 0.37);
  }
  .progress-bar {
    margin-top: 20px;
    width: 40%;
  }
  .error {
    color: red;
    text-align: center;
  }
  h2 {
    text-align: center;
  }
  .body-mooc button {
    margin: 20px;
  }
  b.or {
    margin-top: 20px;
  }
</style>
