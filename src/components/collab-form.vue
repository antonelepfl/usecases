<template>
  <div class="collab-form">
    <!--just in case a hidden logout button -->
    <md-button class="md-raised md-primary button-medium" style="display: none" v-on:click="logout">Logout</md-button>
    <div class="header">Define in which collab you want to work</div>
    <md-tabs md-fixed class="elevated">
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
        appName: '',
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
      // TODO: improve this param from route
      var newEntry = this.typesCollabsApps[this.$route.params.uc_name]
      if (newEntry) {
        this.appId = newEntry.appid
        this.appName = newEntry.entryname
      } else {
        console.error('No entry in collabs apps json')
      }
    },
    methods: {
      collabSelected (collab) {
        var that = this
        this.getAllNav(collab.id).then(function (parentNav) {
          var exists = that.checkExists(parentNav, that.appId, that.appName)
          if (!exists.found) {
            var entryName = that.typesCollabsApps[that.uc_name].entryname
            that.createNavEntry(entryName, collab.id, parentNav.id, that.appId)
            // TODO replace first two lines for all below to COPY the elemement instead of pointing
            // that.getCollabStorage(collab.id).then(function (projectStorage) {
            //   var parent = projectStorage.results[0].uuid
            //   var contentType = 'x-ipynb+json'
            //   var name = 'file test 1'
            //   that.createFile(name, contentType, parent).then(function (file) {
            //     that.copyFileContent('c761b11d-f08d-42a0-a98e-cc97b6ce9278', file.uuid).then(function (copy) {
            //       debugger
            //       var entryName = that.typesCollabsApps[that.uc_name].entryname
            //       that.createNavEntry(entryName, collab.id, parentNav.id, that.appId, file.uuid)
            //     })
            //   })
            // })
          } else {
            console.debug('Existing app in collab found')
            that.redirectToCollab(collab.id, exists.navitemId)
          }
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
          if (error.body.title) { // to catch the collab already exists
            that.isLoading = false
            that.errorMessage = error.body.title[0]
          }
        })
      },
      checkExists (nav, appId, appName) {
        if (nav.children) {
          let item = {'found': false, 'navitemId': 0}
          let i = 0
          while (!item.found && nav.children.length > i) {
            if (nav.children[i].app_id === appId.toString() &&
              nav.children[i].name === appName) {
              item.found = true
              item.navitemId = nav.children[i].id
            }
            i = i + 1
          }
          return item
        }
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
