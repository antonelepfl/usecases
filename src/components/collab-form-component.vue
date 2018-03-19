<template>
  <!-- This component emits 'collabSelected' and 'collabCreated' events to the parent-->
  <div class="collab-form-component">
    <div class="header">Define in which collab you want to work</div>
    <md-tabs md-fixed class="elevated">
      <md-tab id="search" md-label="Search" md-icon="search" class="container-centered">
        <md-input-container>
          <label>Collab Name</label>
          <md-input placeholder="Search in your collabs" v-model.lazy="searchText"></md-input>
        </md-input-container>

        <div v-if="!isLoadingLocal" class="collabs-results-container">
          <div v-for="collab in collabResults" class="collab-result" >
            <a class="nota" @click="collabSelected(collab)">{{ collab.title }}</a>
          </div>
        </div>

        <div v-show="isLoadingLocal" class="progress-bar">
          <md-progress class="md-accent" md-indeterminate></md-progress>
        </div>
        <span class="error-message">{{errorMessage}}</span>
      </md-tab>

      <md-tab id="create" md-label="Create"  md-icon="create" class="container-centered" >
        <md-input-container>
          <label>Collab Name</label>
          <md-input placeholder="Create new collab" v-model.lazy="searchText"></md-input>
        </md-input-container>

        <div v-show="!isLoadingLocal" class="centered">
          <md-button class="md-raised md-primary button-medium separated" @click.native="createNewCollab">Create</md-button>
          <md-switch v-model="private" id="priv_pub" name="priv_pub" class="md-primary priv_pub separated">{{private_public}}</md-switch>
          <span class="error-message">{{errorMessage}}</span>
        </div>

        <div v-show="isLoadingLocal" class="progress-bar">
          <md-progress class="md-accent" md-indeterminate></md-progress>
        </div>
      </md-tab>
    </md-tabs>

  </div>
</template>

<script>
  import createCollab from 'mixins/createCollab.js'
  
  export default {
    name: 'collabFormComponent',
    props: ['isLoading'],
    data () {
      return {
        private: false,
        searchText: '',
        collabResults: [],
        errorMessage: '',
        isLoadingLocal: this.isLoading,
        timeoutId: 0 // to delay the collab search
      }
    },
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
        let that = this
        this.getCollabStorage(collab.id).then(function () {
          that.$emit('collabSelected', collab)
        })
      },
      createNewCollab () {
        var that = this
        this.errorMessage = ''
        if (!this.searchText) {
          this.errorMessage = 'Name is require'
          return
        }
        var isPrivate = (this.$el.querySelector('#priv_pub').value === 'true') // to convert in bool
        this.isLoadingLocal = true
        this.createCollab(this.searchText, isPrivate)
        .then(function (collab) {
          that.getCollabStorage(collab.id).then(function () {
            that.$emit('collabCreated', collab)
          })
        }, function (error) {
          that.errorMessage = error
          that.isLoadingLocal = false
        })
      },
      search (newVal) {
        var that = this
        if (newVal === '') {
          that.collabResults = []
          that.errorMessage = ''
        } else {
          that.isLoadingLocal = true
          this.searchCollab(newVal).then(function (result) {
            if (that.errorMessage !== '') {
              that.errorMessage = ''
            }
            that.collabResults = result
            that.isLoadingLocal = false
          }, function (reject) {
            that.errorMessage = 'Getting your collabs ...'
          })
        }
      }
    },
    watch: {
      'searchText' (newVal) {
        var that = this
        clearTimeout(this.timeoutId)
        this.timeoutId = setTimeout(function () {
          that.search(newVal)
        }, 500)
      },
      'isLoading' (newVal) {
        this.isLoadingLocal = newVal
      }
    }
  }
</script>

<style>
  .collab-form-component .centered {
    margin-left: 150px;
  }
  .collab-form-component .centered .separated {
    margin-right: 50px;
  }
  .button-medium {
    max-width: 150px;
  }
  .collab-form-component .md-theme-default.md-tabs>.md-tabs-navigation {
    background-color: #ac6067;
  }
  .collab-form-component .md-tabs-content {
    width: 550px;
    margin: 0 auto;
  }
  .collab-form-component .md-theme-default.md-button:not([disabled]).md-primary.md-raised.button-medium {
    background-color: #ac6067;
  }
  .collab-form-component button.md-tab-header.md-active {
    background-color: #884f4d;
    color: white;
  }
  .collab-form-component .md-theme-default.md-tabs>.md-tabs-navigation .md-tab-indicator {
    background-color: #1c287e;
  }
  .collab-form-component .md-theme-default.md-tabs>.md-tabs-navigation {
    background-color: #ac6067;
  }
  .collab-form-component .priv_pub {
    font-size: 20px;
  }
  .collab-form-component .login-logout {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .collab-form-component .header {
    text-align: center;
    color: #fff;
    background-color: rgb(172, 96, 103);
    padding: 25px 20px;
    font-size: 20px;
    font-weight: 600;
    width: 100%;
  }
  .collab-form-component .elevated {
    min-height: 300px;
  }
  .collabs-results-container {
    max-height: 400px;
    overflow: scroll;
  }
  .collabs-results-container .collab-result > a.nota {
    color: #ac6067;
    cursor: pointer;
    padding: 10px;
  }
  .collab-form-component span.error-message {
    display: block;
    color: red;
    margin-left: 25px;
  }
</style>
