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
          <md-button class="md-raised md-primary button-medium separated" @click.native="createNew">Create</md-button>
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
  var hbpHello = require('../assets/hbp.hello.js').hellojs
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  Vue.use(VueResource)

  hbpHello.init({
    hbp: '74b1a180-3646-45ac-b53c-ebd905cec418'
  })

  export default {
    name: 'collabForm',
    data () {
      return {
        private: true,
        authenticated: false,
        searchText: '',
        collabAPI: 'https://services.humanbrainproject.eu/collab/v0/',
        collabResults: [],
        isLoading: false,
        errorMessage: '',
        isJupyter: false
      }
    },
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
    },
    methods: {
      login (displayMethod) {
        if (displayMethod === undefined) { displayMethod = 'page' }
        var that = this
        hbpHello.login('hbp', {'display': displayMethod, force: false}).then(function (event) {
          if (event.authResponse.access_token) {
            that.saveAuthentication(that, event.authResponse)
          }
        }, function (e) {
          console.debug('Authentication Error', e)
        });
      },
      logout () {
        var that = this
        hbpHello.logout('hbp').then(function (event) {
          that.authenticated = false;
        }, function (e) {
          console.debug('Logout Error', e)
        });
      },
      searchCollab (param) {
        this.collabResults = []
        this.$http.get(this.collabAPI + 'mycollabs/?search=' + param).then(function (response) {
          if (param.length > 0) {
            this.collabResults = response.body.results
          }
        }, function (responseError) {
          if (responseError.status === 401) {
            this.collabResults.push = 'Getting your collabs ...'
            this.login('none')
          }
          console.error(responseError)
        })
      },
      saveAuthentication (context, auth) {
        context.authenticated = true;
        Vue.http.headers.common['Authorization'] = 'Bearer ' + auth.access_token;
      },
      createNew () {
        var isPrivateString = this.$el.querySelector('#priv_pub').value
        var isPrivate = (isPrivateString === 'true'); // to convert in bool
        this.createCollab(this.searchText, isPrivate)
      },
      createNavEntry (entryName, collabId, parentId) {
        var context = this.createGuid()
        var that = this
        var type = 'IT'
        var payload = {
          'app_id': 271,
          'context': context,
          'name': entryName,
          'order_index': 1,
          'parent': parentId,
          'type': type,
          'collab': collabId
        }
        this.setAppId(payload)
        var collabReq = this.collabAPI + 'collab/' + collabId + '/nav/'
        this.$http.post(collabReq, payload).then(function (response) {
          if (that.isJupyter) {
            console.log('response:', response)
            var jupyterNotebookUrl = 'https://services.humanbrainproject.eu/document/v0/api/file/775888cb-04d8-405b-bf86-7d580899eb32/metadata'
            var context2 = 'ctx_' + context
            var payload = {}
            payload[context2] = 1
            console.log('payload', payload)
            that.$http.put(jupyterNotebookUrl, payload).then(function (response) {
              that.getNavRoot(collabId).then(function (parentRoot) { // to show the lasts added
                that.redirectToCollab(collabId)
              })
            })
          } else {
            that.getNavRoot(collabId).then(function (parentRoot) { // to show the lasts added
              that.redirectToCollab(collabId)
            })
          }
        })
      },
      createCollab (collabTitle, isPrivate) {
        var collabReq = this.collabAPI + 'collab/'
        var that = this
        var payload = {
          'title': collabTitle,
          'private': isPrivate,
          'content': collabTitle
        }
        this.isLoading = true
        this.$http.post(collabReq, payload).then(function (response) {
          var collabId = response.body.id
          debugger
          that.getNavRoot(collabId).then(function (parentRoot) {
            that.createNavEntry(collabTitle, collabId, parentRoot)
          })
        }, function (error) {
          that.isLoading = false
          if (error.body.title) {
            that.errorMessage = error.body.title[0]
          }
        })
      },
      getNavRoot (collabId) {
        var url = this.collabAPI + 'collab/' + collabId + '/nav/root/'
        var that = this
        return new Promise(function (resolve, reject) {
          that.$http.get(url).then(function (response) {
            var parentRoot = response.body.id
            resolve(parentRoot)
          })
        })
      },
      createGuid () {
        function s4 () {
          return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
      },
      setAppId (payload) {
        switch (this.$route.params.uc_name) {
          case 'featureextraction':
            payload.app_id = 301
            break
          case 'synapticeventsfitting':
            payload.app_id = 175
            this.isJupyter = true
            break
        }
      },
      collabSelected (collab) {
        var that = this
        var collabTitle = this.$route.params.uc_name
        this.getNavRoot(collab.id).then(function (parentRoot) {
          that.createNavEntry(collabTitle, collab.id, parentRoot)
        })
      },
      redirectToCollab (collabId) {
        window.parent.postMessage({
          eventName: 'collab.open',
          data: {
            id: collabId
          }
        }, '*');
        this.errorMessage = 'Collab created but not redirected (it is not embed)'
        this.isLoading = false
      }
    },
    watch: {
      'searchText' (newVal) {
        this.searchCollab(newVal)
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
