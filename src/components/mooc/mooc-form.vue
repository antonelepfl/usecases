<template>
  <div class="mooc-form">
    <div class="title">Reconstruction and simulation of neural tissue I: Neurons and Synapses</div>

    <md-whiteframe md-tag="section" class="body-mooc">
      <md-button class="md-raised md-primary" @click.native="createNewCollab">Create a colab</md-button>
      <div v-show="isLoading" class="progress-bar">
        <md-progress class="md-accent" md-indeterminate></md-progress>
      </div>

      <div class="separator"><label>OR</label></div>
      <b>Search for an existing collab</b>

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
    margin: 100px auto 0 auto;
    max-width: 500px;
    padding: 10px;
    background-color: rgba(214, 233, 250, 0.2);
    min-height: 280px;
  }
  .mooc-form > .title {
    box-shadow: 0 2px 5px rgba(0,0,0,.26);
    position: fixed;
    text-align: center;
    color: #fff;
    background-color: rgba(172, 96, 103, 0.95);
    padding: 20px;
    font-size: 20px;
    font-weight: 600;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 3;
  }
  .progress-bar {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 40%;
  }
  .error {
    color: red;
    text-align: center;
    margin-bottom: 20px;
  }
  .md-theme-default a:not(.md-button):hover {
    color: #1c1c47;
    cursor: pointer;
  }
  .md-theme-default a:not(.md-button) {
    color: #8888cb;
  }
  .body-mooc button {
    margin: 20px;
  }
  .md-theme-default.md-button:not([disabled]).md-primary.md-raised {
    background-color: #74a1c9;
  }
  .separator {
    position: relative;
    text-align: center;
    width: 100%;
    margin: 10px auto;
  }
  .separator label {
    background-color: #f7fbfe;
    padding: 0 0.4em;
    position: relative;
  }
  .separator::before {
    content: '';
    border-style: solid;
    border-width: 0 0 1px 0;
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    border-color:black;
  }
</style>
