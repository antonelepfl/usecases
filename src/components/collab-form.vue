<template>
   <div class="collab-form">      
      <md-tabs v-if="authenticated" md-fixed class="elevated">
         <md-tab id="search" md-label="Search" md-icon="search" class="container-centered">
            <md-input-container>
               <label>Collab Name</label>
               <md-input placeholder="Search in your collabs" v-model.lazy="searchText"></md-input>
            </md-input-container>
            <div v-for="collab in collabResults">
               <div>{{ collab.title }}</div>
            </div>
            <md-button class="md-raised md-primary button-medium">Search</md-button>
         </md-tab>

         <md-tab id="create" md-label="Create"  md-icon="create" class="container-centered">
            <md-input-container>
               <label>Collab Name</label>
               <md-input placeholder="Create new collab"></md-input>
            </md-input-container>
            <md-switch v-model="private" id="priv_pub" name="priv_pub" class="md-primary priv_pub">{{private_public}}</md-switch>
            <md-button class="md-raised md-primary button-medium">Create</md-button>
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
      // hbp: '2bc1364d-1039-495b-b51e-608108cbefce' // Replace with your app id
      hbp: '74b1a180-3646-45ac-b53c-ebd905cec418'
   })

   export default {
      name: 'collabForm',
      data () {
         return {
            private: false,
            authenticated: false,
            searchText: '',
            collabAPI: 'https://services.humanbrainproject.eu/collab/v0/mycollabs/?search=',
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
         // knowing if the token is stil valid
         var auth = hbpHello.getAuthResponse('hbp')
         if (auth) {
            this.authenticated = true
            Vue.http.headers.common['Authorization'] = 'Bearer ' + auth.access_token;
         } else {
           this.login()
         }
      },
      methods: {
         login () {
            var that = this
            hbpHello.login('hbp', {'display': 'page'}).then(function (event) {
               if (event.authResponse.access_token) {
                  that.authenticated = true;
                  console.info('User Authenticated')
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
            if (param.length > 0) {
               this.$http.get(this.collabAPI + param).then(function (response) {
                  this.collabResults = response.body.results
               }, function (responseError) {
                  console.error(responseError)
                  // error callback
               });
            } else {
               this.collabResults = []
            }
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
   .container-centered {
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-pack: center;
      align-items: center;
   }
   .collab-form {
      max-width: 600px;
      margin: auto;
   }
   .button-medium {
      max-width: 150px;
   }
   .collab-form .md-theme-default.md-tabs>.md-tabs-navigation {
      background-color: #ac6067;
   }
   .collab-form .md-theme-default.md-button:not([disabled]).md-primary.md-raised.button-medium {
      background-color: #ac6067;
   }
   .collab-form button.md-tab-header.md-active {
      background-color: #884f4d;
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
   .collab-form .explanation {
      font-size: 22px;
      font-family: sans-serif;
   }
   .collab-form .elevated {
      margin-top: 10px;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12)
   }
</style>