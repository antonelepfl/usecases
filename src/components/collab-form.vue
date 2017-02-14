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
          <div v-for="collab in collabResults" class="collab-result">
            <a class="nota" href="#">{{ collab.title }}</a>
          </div>
        </div>
      </md-tab>

      <md-tab id="create" md-label="Create"  md-icon="create" class="container-centered" >
        <md-input-container>
          <label>Collab Name</label>
          <md-input id="collab-create-name" placeholder="Create new collab"></md-input>
        </md-input-container>
        <div class="centered">
          <md-button class="md-raised md-primary button-medium separated" v-on:click="createNew">Create</md-button>
          <md-switch v-model="private" id="priv_pub" name="priv_pub" class="md-primary priv_pub separated">{{private_public}}</md-switch>
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
        private: false,
        authenticated: false,
        searchText: '',
        collabAPI: 'https://services.humanbrainproject.eu/collab/v0/',
        collabResults: []
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
          console.info('User Logged Out')
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
        console.info('User Authenticated')
        Vue.http.headers.common['Authorization'] = 'Bearer ' + auth.access_token;
      },
      createNew () {
        var collabName = this.$el.querySelector('#collab-create-name').value
        this.createNavEntry(collabName)
      },
      //  createNavEntry(input_nav, app_id, output_collab_id, oidc, folders_mapping) {
      createNavEntry (collabName) {
        var collabId = 1854;
        var context = this.createGuid()
        var type = 'IT'
        var payload = {
          'app_id': 271,
          'context': context,
          'name': collabName,
          'order_index': 0,
          'parent': 16942,
          'type': type,
          'collab': collabId
        }
        console.log(collabReq, payload)
        var collabReq = this.collabAPI + 'collab/' + collabId + '/nav/'
        this.$http.post(collabReq, payload).then(function (response) {
          console.log(response)
          window.parent.postMessage({
            eventName: 'collab.open',
            data: {
              id: collabId
            }
          }, '*');
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
      }
    },
    watch: {
      'searchText' (newVal) {
        this.searchCollab(newVal)
      }
    }
  }
</script>

<style>
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
</style>
