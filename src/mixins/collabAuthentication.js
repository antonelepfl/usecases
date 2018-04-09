var hbpHello = require('../assets/hbp.hello.js').hellojs
var store = require('./store.js').default
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
    login (displayMethod = 'none', force = false) {
      return new Promise(function (resolve, reject) {
        hbpHello.login('hbp', {'display': displayMethod, 'force': force, 'page_uri': window.location.href})
        .then(function (res) {
          resolve(res.authResponse.access_token)
        }, function (e) {
          console.debug('Login Error', e)
          reject()
        });
      })
    },
    logout (force = false) {
      return new Promise(function (resolve, reject) {
        hbpHello.logout('hbp', {force: force})
        .then(function (event) {
          console.debug('User Logout OK')
          resolve()
        }, function (e) {
          console.debug('Logout Error', e)
          reject()
        });
      })
    },
    renewToken () {
      this.logout().then(() => {
        this.login('page', true)
      })
    },
    getAuthResponse () {
      let session = hbpHello.getAuthResponse('hbp');
      var currentTime = (new Date()).getTime() / 1000;
      let valid = session && session.access_token && session.expires > currentTime + 1000;
      if (valid) store.setToken(session.access_token)
      return valid
    }
  }
}
