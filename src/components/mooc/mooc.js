import createCollab from 'mixins/createCollab.js'
import collabAuthentication from 'mixins/collabAuthentication.js'
import typesCollabsApps from 'assets/config_files/types_collabs_apps.json'
const COLLAB_API = 'https://services.humanbrainproject.eu/collab/v0/'
export default {
  mixins: [collabAuthentication, createCollab],
  data: function () {
    return {
      collabId: undefined,
      navitemId: undefined
    }
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
        }, function (error) {
          console.error(error)
          return Promise.resolve({'collabId': collabId})
        })
        .then(function (newFileId) {
          if (!appInfo.justcopy) {
            return that.createNavEntry(appInfo.entryname, collabId, parentNav.id, appInfo.appid, newFileId)
          } else { return Promise.resolve({'collabId': collabId}) }
        }, reject)
        .then(function (obj) {
          if (obj.navitemId && that.navitemId === undefined) {
            that.navitemId = obj.navitemId
          }
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
          return that.createCoursesMooc(collab, uc).then(resolve, reject)
        })
      })
    },
    addMoocExistingCollab (collab, uc) {
      return this.createCoursesMooc(collab, uc)
    },
    createCoursesMooc (collab, uc) { // cretes mooc -> weeks
      var that = this
      return new Promise(function (resolve, reject) {
        let moocUc = typesCollabsApps[uc]
        let coursesPromises = []
        if (moocUc && moocUc.children) {
          for (let i = 0; i < moocUc.children.length; i++) {
            let creat = that.createItemInExistingCollab(collab, moocUc.children[i])
            coursesPromises.push(creat)
          }
          Promise.all(coursesPromises)
          .then(function (elements) {
            that.collabCreationProgress = that.collabCreationProgress + 20
            if (that.navitemId) {
              that.redirectToCollab(collab.id, that.navitemId)
              setTimeout(resolve, 1500)
              return
            }
            that.redirectToCollab(collab.id)
            setTimeout(resolve, 1500)
          }, function (error) { // probably the collab already exist error
            if (error.body && error.body.title) {
              reject(error.body.title[0])
            } else {
              reject(error)
            }
          })
        }
      })
    },
    createItemInExistingCollab (collab, uc) { // creates weeks -> files
      var ucInfo = uc
      var that = this
      return new Promise(function (resolve, reject) {
        if (ucInfo === undefined) {
          reject('No item in typesCollabsApps.json')
        } else {
          that.getAllNav(collab.id).then(function (parentNav) {
            var exists = {};
            var promises = []
            for (let i = 0; i < ucInfo.length; i++) {
              var item = ucInfo[i]
              exists = that.checkExists(parentNav, item.appid, item.entryname)
              if (!exists.found) {
                promises.push(that.generateNotebook(collab.id, item, parentNav))
              }
            }
            if (promises.length === 0) {
              exists['collabId'] = collab.id
              resolve([exists])
            } else {
              Promise.all(promises)
              .then(function (elements) {
                that.collabCreationProgress = that.collabCreationProgress + 15
                resolve(promises)
              }, reject)
            }
          }, reject)
        }
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
