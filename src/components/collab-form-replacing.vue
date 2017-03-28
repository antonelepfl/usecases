<template>
  <div class="collab-form">
    <div class="header">Define in which collab you want to work</div>
    <md-tabs md-fixed class="elevated">
      <md-tab id="search" md-label="Search" md-icon="search" class="container-centered">
        <md-input-container>
          <label>Collab Name</label>
          <md-input placeholder="Search in your collabs" v-model.lazy="searchText"></md-input>
        </md-input-container>

        <div v-if="!isLoading" class="collabs-results-container">
          <div v-for="collab in collabResults" class="collab-result" >
            <a class="nota" @click="collabSelected(collab)">{{ collab.title }}</a>
          </div>
        </div>

        <div v-show="isLoading" class="progress-bar">
          <md-progress class="md-accent" md-indeterminate></md-progress>
        </div>
        <span class="error-message">{{errorMessage}}</span>
      </md-tab>

      <md-tab id="create" md-label="Create"  md-icon="create" class="container-centered" >
        <md-input-container>
          <label>Collab Name</label>
          <md-input placeholder="Create new collab" v-model.lazy="searchText"></md-input>
        </md-input-container>

        <div v-show="!isLoading" class="centered">
          <md-button class="md-raised md-primary button-medium separated" @click.native="createNewCollab">Create</md-button>
          <md-switch v-model="private" id="priv_pub" name="priv_pub" class="md-primary priv_pub separated">{{private_public}}</md-switch>
          <span class="error-message">{{errorMessage}}</span>
        </div>

        <div v-show="isLoading" class="progress-bar">
          <md-progress class="md-accent" md-indeterminate></md-progress>
        </div>
      </md-tab>
    </md-tabs>

  </div>
</template>

<script>
  import createCollab from '../mixins/createCollab.js'

  export default {
    name: 'collabForm',
    data () {
      return {
        private: true,
        searchText: '',
        collabResults: [],
        isLoading: false,
        errorMessage: ''
      }
    },
    props: ['model_name', 'folder_name'],
    mixins: [createCollab], // use common functions
    computed: {
      private_public () {
        if (this.private) {
          return 'Private'
        }
        return 'Public'
      }
    },
    methods: {
      collabSelected: function (collab) {
        this.isLoading = true
        var that = this
        this.createItemInExistingCollabWithReplace(collab, this.model_name, this.folder_name)
        .then(function () {
          that.isLoading = false
        }, function (error) { that.errorMessage = error })
      },
      createNewCollab () {
        var that = this
        this.isLoading = true
        var isPrivate = (this.$el.querySelector('#priv_pub').value === 'true') // to convert in bool
        this.createItemInNewCollabWithReplace(isPrivate, this.searchText, this.model_name, this.folder_name)
        .then(function () {
          that.isLoading = false
        },
        function (error) {
          that.errorMessage = error
          that.isLoading = false
        })
      }
    },
    watch: {
      'searchText' (newVal) {
        var that = this
        this.searchCollab(newVal).then(function (result) {
          if (that.errorMessage !== '') {
            that.errorMessage = ''
          }
          that.collabResults = result
        }, function (reject) {
          that.errorMessage = 'Getting your collabs ...'
        })
      }
    }
  }
</script>

<style >
  .collab-form .centered {
    margin-left: 150px;
  }
  .collab-form .centered .separated {
    margin-right: 50px;
  }
  .button-medium {
    max-width: 150px;
  }
  .collab-form .md-theme-default.md-tabs>.md-tabs-navigation {
    background-color: #ac6067;
  }
  .collab-form .md-tabs-content {
    width: 550px;
    margin: 0 auto;
  }
  .collab-form .md-theme-default.md-button:not([disabled]).md-primary.md-raised.button-medium {
    background-color: #ac6067;
  }
  .collab-form button.md-tab-header.md-active {
    background-color: #884f4d;
    color: white;
  }
  .collab-form .md-theme-default.md-tabs>.md-tabs-navigation .md-tab-indicator {
    background-color: #1c287e;
  }
  .collab-form .priv_pub {
    font-size: 20px;
  }
  .collab-form .login-logout {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .collab-form .header {
    text-align: center;
    color: #fff;
    background-color: rgb(172, 96, 103);
    padding: 25px 20px;
    font-size: 20px;
    font-weight: 600;
    width: 100%;
  }
  .collab-form .elevated {
    min-height: 300px;
  }
  .collabs-results-container .collab-result > a.nota {
    color: #ac6067;
    cursor: pointer;
  }
  .collab-form span.error-message {
    display: block;
    color: red;
    margin-left: 25px;
  }
</style>
