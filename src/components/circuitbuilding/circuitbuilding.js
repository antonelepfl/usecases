import typesCollabsApps from 'assets/config_files/types_collabs_apps.json'
import createCollab from 'mixins/createCollab.js'
import collabAuthentication from 'mixins/collabAuthentication.js'
export default {
  data () {
    return {
      typesCollabsApps: typesCollabsApps
    }
  },
  mixins: [collabAuthentication, createCollab],
  methods: {
    createMultipleItemsInExistingCollab (collab, uc) {
      var that = this
      return new Promise(function (resolve, reject) {
        var ucInfo = that.typesCollabsApps[uc]
        that.getAllNav(collab.id).then(function (parentNav) {
          var exists = {};
          var promises = []
          for (let i = 0; i < ucInfo.children.length; i++) {
            var item = ucInfo.children[i]
            exists = that.checkExists(parentNav, item.appid, item.entryname)
            if (!exists.found) {
              if (item.entryname === '800_800_150_gocconv50_June2014') {
                promises.push(that.copyFileConnectomeCerebellum(collab, item))
              } else {
                promises.push(that.generateNotebook(collab.id, item, parentNav))
              }
            }
          }
          if (promises.length === 0) {
            exists['collabId'] = collab.id
            resolve([exists])
          } else {
            resolve(promises)
          }
        }, reject)
      })
    },
    generateNotebook (collabId, appInfo, parentNav) {
      /* this function creates a file, copy the content of the file
      into new app and create a navitem for that file */
      var that = this
      return new Promise(function (resolve, reject) {
        that.getCollabStorage(collabId)
        .then(function (projectStorage) {
          var parent = projectStorage.results[0].uuid
          return that.createFile(appInfo.entryname, appInfo.contenttype, appInfo.extension, parent)
        })
        .then(function (file) {
          return that.copyFileContent(appInfo.file, file.uuid)
        }, reject)
        .then(function (newFileId) {
          return that.createNavEntry(appInfo.entryname, collabId, parentNav.id, appInfo.appid, newFileId)
        }, reject)
        .then(function (obj) {
          resolve(obj)
        }, reject)
      })
    },
    copyFileConnectomeCerebellum (collab, item) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.getCollabStorage(collab.id).then(function (projectStorage) {
          return that.createFolder('notebooks', projectStorage.results[0].uuid)
        }, reject)
        .then(function (folder) {
          return that.createFile(item.entryname, item.contenttype, item.extension, folder.uuid)
        }, reject)
        .then(function (file) {
          return that.copyFileContent(item.file, file.uuid)
        }, reject)
        .then(function (obj) {
          resolve(obj)
        }, reject)
      })
    }
  }
}
