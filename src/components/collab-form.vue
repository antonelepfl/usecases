<template>
  <div class="collab-form">
    <!--just in case a hidden logout button -->
    <md-button class="md-raised md-primary button-medium" style="display: none" v-on:click="logout">Logout</md-button>
    <div v-show="authenticated" class="header">Define in which collab you want to work</div>
    <md-tabs v-if="authenticated" md-fixed class="elevated">
      <md-tab id="search" md-label="Search" md-icon="search" class="container-centered">
        <md-input-container>
          <label>Collab Name</label>
          <md-input placeholder="Search in your collabs" v-model.lazy="searchText"></md-input>
        </md-input-container>
        <div class="collabs-results-container">
          <div v-for="collab in collabResults" class="collab-result" >
            <a class="nota" @click="collabSelected(collab)">{{ collab.title }}</a>
          </div>
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
        <div v-show="isLoading" class="progress-bar">
          <md-progress class="md-accent" md-indeterminate></md-progress>
        </div>
      </md-tab>
    </md-tabs>

  </div>
</template>

<script>
  import collabAuthentication from '../mixins/collabAuthentication.js'
  import createCollab from '../mixins/createCollab.js'
  import typesCollabsApps from '../assets/config_files/types_collabs_apps.json'

  export default {
    name: 'collabForm',
    data () {
      return {
        private: true,
        searchText: '',
        collabResults: [],
        isLoading: false,
        errorMessage: '',
        isJupyter: false,
        appId: -1,
        typesCollabsApps: typesCollabsApps
      }
    },
    props: ['uc_name'],
    mixins: [collabAuthentication, createCollab], // use common functions
    computed: {
      private_public () {
        if (this.private) {
          return 'Private'
        }
        return 'Public'
      }
    },
    mounted () {
      this.login()
      this.appId = this.typesCollabsApps[this.uc_name].appid
    },
    methods: {
      collabSelected (collab) {
        var that = this
        this.getNavRoot(collab.id).then(function (parentRoot) {
          var entryName = that.typesCollabsApps[that.uc_name].entryname
          that.createNavEntry(entryName, collab.id, parentRoot, that.appId)
        })
      },
      createNewCollab () {
        var that = this
        this.isLoading = true
        var isPrivate = (this.$el.querySelector('#priv_pub').value === 'true') // to convert in bool
        this.createCollab(this.searchText, isPrivate).then(function (collabId) {
          that.getNavRoot(collabId).then(function (parentRoot) {
            var entryName = that.typesCollabsApps[that.uc_name].entryname
            that.createNavEntry(entryName, collabId, parentRoot, that.appId)
            that.isLoading = false
          })
        }, function (error) {
          if (error.body.title) {
            that.isLoading = false
            that.errorMessage = error.body.title[0]
          }
        })
      }
    },
    watch: {
      'searchText' (newVal) {
        var that = this
        this.searchCollab(newVal).then(function (result) {
          that.collabResults = result
        })
        if (this.errorMessage !== '') {
          this.errorMessage = ''
        }
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
  }
  .collab-form span.error-message {
    display: block;
    color: red;
    margin-left: 25px;
  }
</style>
