import createCollab from 'mixins/createCollab.js'
import collabAuthentication from 'mixins/collabAuthentication.js'
const COLLAB_API = 'https://services.humanbrainproject.eu/collab/v0/'
export default {
  mixins: [collabAuthentication, createCollab],
  methods: {
    generateNotebook (collabId, appInfo, parentNav) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.getCollabStorage(collabId)
        .then(function (projectStorage) {
          that.collabCreationProgress = 30
          var parent = projectStorage.results[0].uuid
          return that.createFile(appInfo.entryname, appInfo.contenttype, appInfo.extension, parent)
        })
        .then(function (file) {
          that.collabCreationProgress = 50
          var originalFileId = appInfo.file
          if (!originalFileId) {
            console.error('No entry in typesCollabsApps.json')
            reject()
          }
          return that.copyFileContent(originalFileId, file.uuid)
        }, function (error) {
          console.error(error)
          return Promise.resolve({'collabId': collabId})
        })
        .then(function (newFileId) {
          that.collabCreationProgress = 80
          if (!appInfo.justcopy) {
            return that.createNavEntry(appInfo.entryname, collabId, parentNav.id, appInfo.appid, newFileId)
          } else { return Promise.resolve({'collabId': collabId}) }
        }, reject)
        .then(function (obj) {
          resolve(obj)
        }, reject)
      })
    },
    createMoocCollab (isPrivate, fullCollabName, uc) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.getUserInfo().then(function (user) {
          that.collabCreationProgress = 20
          return that.createCollab(fullCollabName, isPrivate)
        })
        .then(function (collab) {
          that.createItemInExistingCollab(collab, uc)
          .then(resolve, reject)
        }, function (error) { // probably the collab already exist error
          if (error.body && error.body.title) {
            reject(error.body.title[0])
          } else { reject(error) }
        })
      })
    },
    addMoocExistingCollab (collab, uc) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.createItemInExistingCollab(collab, uc).then(resolve, function (error) { // probably the collab already exist error
          if (error.body) {
            reject(error.body.title[0])
          } else {
            reject(error)
          }
        })
      })
    },
    searchCollab (param, moocName) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.getUserInfo().then(function (user) {
          param = param + ' ' + moocName + ' ' + user.displayName
          that.$http.get(COLLAB_API + 'mycollabs/?search=' + param, that.header) // header from CreateCollab
          .then(function (response) {
            resolve(response.body.results)
          },
          function (responseError) {
            if (responseError.status === 401) {
              that.getToken(true) // force renew token
              reject(responseError)
            } else {
              reject(responseError)
            }
          })
        })
      })
    },
    updateFullCollabName (searchText, moocName) {
      let that = this
      this.getUserInfo().then(function (user) {
        let d = new Date().toLocaleString()
        if (searchText === '') {
          searchText = 'Mooc'
        }
        that.fullCollabName = searchText + ' - ' + moocName + ' - ' + user.displayName + ' ' + d
      })
    }
  }
}
