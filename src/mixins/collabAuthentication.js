var hbpHello = require('../assets/hbp.hello.js').hellojs
// replace this with your collab app id
hbpHello.init({
  hbp: '74b1a180-3646-45ac-b53c-ebd905cec418'
})

export default {
  data () {
    return {
      collabAPI: 'https://services.humanbrainproject.eu/collab/v0/'
    }
  },
  methods: {
    login (displayMethod) {
      if (displayMethod === undefined) { displayMethod = 'page' }
      return new Promise(function (resolve, reject) {
        hbpHello.login('hbp', {'display': displayMethod, force: false})
        .then(function (event) {
          console.debug('Login user OK')
          resolve()
        }, function (e) {
          console.debug('Login Error', e)
        });
      })
    },
    logout () {
      return new Promise(function (resolve, reject) {
        hbpHello.logout('hbp', {force: false})
        .then(function (event) {
          console.debug('User Logout OK')
          resolve();
        }, function (e) {
          console.debug('Logout Error', e)
          reject();
        });
      })
    },
    searchCollab (param) {
      this.collabResults = []
      var that = this
      return new Promise(function (resolve, reject) {
        that.getToken().then(function (token) {
          that.$http.get(that.collabAPI + 'mycollabs/?search=' + param, {headers: {'Authorization': token}}).then(
            function (response) {
              if (param.length > 0) {
                resolve(response.body.results)
              }
            },
            function (responseError) {
              if (responseError.status === 401) {
                that.getToken(true) // force renew token
                reject(responseError)
              } else {
                reject(responseError)
              }
          })
        }) // end getToken
      })
    },
    getToken (renew) {
      var that = this
      return new Promise(function (resolve, reject) {
        var localToken = that.getLocalToken()
        if (localToken) { // token exists
          if (renew) {
            localToken.expires = 1 // to force logout and login
            console.log('Renew token forced')
          }
          var currentTime = (new Date()).getTime() / 1000;
          if (localToken.expires > currentTime) { // token is not expired and valid
            var token = 'Bearer ' + localToken.access_token
            resolve(token)
          } else { // token is expired
            that.logout().then(function () {
              that.login().then(function () {
                var token = 'Bearer ' + that.getLocalToken().access_token
                resolve(token)
              })
            })
          }
        } else { // token does not exist
          that.login().then(function () {
            var token = 'Bearer ' + that.getLocalToken().access_token
            resolve(token)
          })
        }
      })
    },
    getLocalToken () {
      // TODO: test without hello {}
      var helloStorage = window.localStorage.hello
      if (helloStorage) {
        var hbpStorage = JSON.parse(helloStorage).hbp
      }
      return hbpStorage
    }
  }
}
