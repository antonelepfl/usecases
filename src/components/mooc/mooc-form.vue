<template>
  <div class="mooc-form" v-if="authenticated">
    <div class="title">Reconstruction and simulation of neural tissue I: Neurons and Synapses</div>

    <md-whiteframe md-tag="section" class="body-mooc">
      <md-button class="md-raised md-primary" @click.native="createNewCollab">Create a collab</md-button>
      <div class="small-label">{{fullCollabName}}</div>
      <div v-show="isLoading" class="progress-bar">
        <md-progress class="md-accent" :md-progress="collabCreationProgress"></md-progress>
      </div>

      <div class="separator"><label>OR</label></div>
      <b>Search for an existing collab</b>

      <md-input-container>
        <label>Collab Name</label>
        <md-input placeholder="Mooc" v-model.lazy="searchText"></md-input>
      </md-input-container>
      <div v-show="!isLoadingLocal" class="collabs-results-container">
        <div v-for="collab in collabResults" class="collab-result" >
          <a class="nota" @click="collabSelected(collab)">{{ collab.title }}</a>
        </div>
      </div>
      <div v-show="isLoadingLocal" class="progress-bar">
        <md-progress class="md-accent" :md-progress="collabCreationProgress"></md-progress>
      </div>

      <div class="error">
        {{errorMessage}}
      </div>
    </md-whiteframe>
  </div>
</template>

<script>
  import mooc from './mooc.js'
  import collabAuthentication from 'mixins/collabAuthentication.js'
  export default {
    name: 'moocForm',
    data () {
      return {
        private: true,
        searchText: '',
        moocName: 'Neuron and Synapse',
        isLoading: false,
        errorMessage: '',
        isLoadingLocal: false,
        collabResults: [],
        collabCreationProgress: 0,
        fullCollabName: '',
        timeoutId: 0,
        authenticated: false
      }
    },
    props: ['uc_name'],
    mixins: [mooc, collabAuthentication], // use common functions
    methods: {
      createNewCollab () {
        var that = this
        var isPrivate = true
        this.isLoading = true
        this.errorMessage = ''
        this.collabCreationProgress = 10;
        this.createMoocCollab(isPrivate, this.fullCollabName, this.uc_name)
        .then(function () {
          that.collabCreationProgress = 100;
          that.isLoading = false
        },
        function (error) {
          if (error === 'collab with this title already exists.') {
            console.debug('Collab name already exist')
            that.errorMessage = 'Please try again'
            that.isLoading = false
          } else {
            that.errorMessage = 'Error during creation: ' + error
            that.isLoading = false
          }
        })
      },
      collabSelected (collab) {
        var that = this
        that.isLoadingLocal = true
        this.collabCreationProgress = 10;
        this.addMoocExistingCollab(collab, this.uc_name).then(function () {
          that.isLoadingLocal = false
        }, function (error) {
          that.errorMessage = error
          that.isLoadingLocal = false
        })
      }
    },
    mounted () {
      let that = this
      this.$nextTick(function () { // waits until token is saved in mixins headers
        that.updateFullCollabName(this.searchText, this.moocName)
      })
    },
    watch: {
      'searchText' (newVal) {
        var that = this
        this.updateFullCollabName(this.searchText, this.moocName)
        if (newVal === '') {
          that.collabResults = []
          that.errorMessage = ''
          that.isLoadingLocal = false
          return;
        }
        clearTimeout(this.timeoutId)
        this.timeoutId = setTimeout(function () {
          that.isLoadingLocal = true
          that.searchCollab(newVal, that.moocName).then(function (result) {
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
        }, 500)
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
    width: 60%;
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
  .small-label {
    font-size: 11px;
  }
  .collabs-results-container {
    max-height: 400px;
    overflow: scroll;
  }
</style>
