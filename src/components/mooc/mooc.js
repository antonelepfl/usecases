import typesCollabsApps from 'assets/config_files/types_collabs_apps.json'
import createCollab from 'mixins/createCollab.js'
import collabAuthentication from 'mixins/collabAuthentication.js'
export default {
  data () {
    return {
      typesCollabsApps: typesCollabsApps,
      header: {}
    }
  },
  mixins: [collabAuthentication, createCollab],
  created () {
    let that = this
    this.getToken().then(function (token) {
      that.header = {headers: {'Authorization': token}}
    }) // from collabAuthentication
  },
  methods: {
    generateNotebook (collabId, appInfo, parentNav) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.getCollabStorage(collabId)
        .then(function (projectStorage) {
          var parent = projectStorage.results[0].uuid
          return that.createFile(appInfo.entryname, appInfo.contenttype, appInfo.extension, parent)
        })
        .then(function (file) {
          var originalFileId = appInfo.file
          if (!originalFileId) {
            console.error('No entry in typesCollabsApps.json')
            reject()
          }
          return that.copyFileContent(originalFileId, file.uuid)
        }, reject)
        .then(function (newFileId) {
          if (!appInfo.justcopy) {
            return that.createNavEntry(appInfo.entryname, collabId, parentNav.id, appInfo.appid, newFileId)
          } else { return Promise.resolve({'collabId': collabId}) }
        }, reject)
        .then(function (obj) {
          resolve(obj)
        }, reject)
      })
    },
    createMoocCollab (isPrivate, searchText, uc) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.getUserInfo().then(function (user) {
          let d = new Date()
          d = d.toLocaleDateString() + '-' + d.toLocaleTimeString()
          let collabName = searchText + ' ' + user.displayName + ' ' + d
          return that.createCollab(collabName, isPrivate)
        })
        .then(function (collab) {
          that.createItemInExistingCollab(collab, uc)
          .then(resolve, reject)
        }, function (error) { // probably the collab already exist error
          reject(error.body.title[0])
        })
      })
    }
  }
}
