import createCollab from 'mixins/createCollab.js'
import collabAuthentication from 'mixins/collabAuthentication.js'
import typesCollabsApps from 'assets/config_files/types_collabs_apps.json'
const COLLAB_API = 'https://services.humanbrainproject.eu/collab/v0/'
export default {
  mixins: [collabAuthentication, createCollab],
  data: function () {
    return {
      navitemId: null,
      moocUc: null,
      initialEntryName: null
    }
  },
  methods: {
    generateFiles (collabId, appInfo, parentNav) { // modified version.
      // it returns objects that has to be created in the navitem
      var that = this
      return new Promise(function (resolve, reject) {
        that.getCollabStorage(collabId)
        .then(function (projectStorage) {
          var parent = projectStorage.results[0].uuid
          return that.createFile(appInfo.entryname, appInfo.contenttype, appInfo.extension, parent, collabId)
        })
        .then(function (file) {
          var originalFileId = appInfo.file
          if (!originalFileId) {
            console.error('No entry in typesCollabsApps.json')
            return reject('No entry in typesCollabsApps.json')
          }
          return that.copyFileContent(originalFileId, file.uuid)
        }, function (error) {
          console.error(error)
          return Promise.resolve({'collabId': collabId})
        })
        .then(function (newFileId) {
          if (!appInfo.justcopy) {
            that.collabCreationProgress = that.collabCreationProgress + 15
            if (appInfo.initial) {
              that.initialEntryName = appInfo.entryname
            }
            return resolve({
              'entryname': appInfo.entryname,
              'collabId': collabId,
              'parentId': parentNav.id,
              'appId': appInfo.appid,
              'newFileId': newFileId
            })
          } else { return resolve({'collabId': collabId, 'entryname': appInfo.entryname}) }
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
        that.moocUc = typesCollabsApps[uc]
        let coursesPromises = []
        if (that.moocUc && that.moocUc.children) {
          for (let i = 0; i < that.moocUc.children.length; i++) {
            let creat = that.createItemInExistingCollab(collab, that.moocUc.children[i])
            coursesPromises.push(creat)
          }
          Promise.all(coursesPromises).then(function (elements) {
            return that.generateNavItems(elements)
          }, function (error) { // probably the collab already exist error
            if (error.body && error.body.title) {
              reject(error.body.title[0])
            } else {
              reject(error)
            }
          })
          .then(function () {
            that.collabCreationProgress = that.collabCreationProgress + 20
            if (that.navitemId) {
              that.redirectToCollab(collab.id, that.navitemId)
              setTimeout(resolve, 1500)
              return
            }
            that.redirectToCollab(collab.id)
            setTimeout(resolve, 1500)
          })
        }
      })
    },
    createItemInExistingCollab (collab, uc) { // creates weeks -> files. Modified.
      // returns the info to generate entry
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
                promises.push(that.generateFiles(collab.id, item, parentNav))
              } else if (that.navitemId === null && item.initial) {
                that.navitemId = exists.navitemId
              }
            }
            if (promises.length === 0) {
              exists['collabId'] = collab.id
              resolve([exists])
            } else {
              Promise.all(promises).then(resolve)
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
    },
    findInitialEntry (entry, queryName) {
      return entry.entryName === queryName
    },
    findNotebook (entry) {
      return entry.justcopy === false
    },
    findEntryInStructure (unsortedCourses, entryName) {
      // will find an element in the courses -> children structure
      for (let i = 0; i < unsortedCourses.length; i++) {
        let unsortedItems = unsortedCourses[i]
        for (let j = 0; j < unsortedItems.length; j++) {
          let item = unsortedItems[j]
          if (item.entryname === entryName) {
            return item;
          }
        }
      }
    },
    setInitialNavItem (elem) {
      if (this.navitemId == null && this.initialEntryName === elem.entryName) {
        this.navitemId = elem.navitemId
      }
    },
    generateNavItems (unsortedCourses) {
      let that = this
      return new Promise(function (resolve, reject) {
        // let promiseArray = []
        // for (let i = 0; i < unsortedCourses.length; i++) {
        //   let notebook = that.moocUc.children[i].find(that.findNotebook)
        //   if (notebook) {
        //     let item = that.findEntryInStructure(unsortedCourses, notebook.entryname)
        //     promiseArray.push(that.createNavEntry(item.entryname, item.collabId, item.parentId, item.appId, item.newFileId))
        //   }
        // }
        // Promise.mapSeries(promiseArray, function (elem) {
        //   console.log(elem)
        //   if (that.navitemId == null && that.initialEntryName === elem.entryName) {
        //     that.navitemId = elem.navitemId
        //   }
        // })

        // TOOD convert this in parallel when collab order works
        let notebook = that.moocUc.children[0].find(that.findNotebook)
        if (notebook) {
          let item = that.findEntryInStructure(unsortedCourses, notebook.entryname)
          let p = null
          if (item) {
            p = that.createNavEntry(item.entryname, item.collabId, item.parentId, item.appId, item.newFileId)
          } else {
            console.debug(notebook.entryname + ' already exists')
            p = Promise.resolve()
          }
          p.then(function (elem) {
            that.setInitialNavItem(elem)
            let notebook = that.moocUc.children[1].find(that.findNotebook)
            if (notebook) {
              let item = that.findEntryInStructure(unsortedCourses, notebook.entryname)
              let p = null // temp promise usage for create or return resolve
              if (item) {
                p = that.createNavEntry(item.entryname, item.collabId, item.parentId, item.appId, item.newFileId)
              } else {
                console.debug(notebook.entryname + ' already exists')
                p = Promise.resolve()
              }
              p.then(function (elem) {
                that.setInitialNavItem(elem)
                let notebook = that.moocUc.children[2].find(that.findNotebook)
                if (notebook) {
                  let item = that.findEntryInStructure(unsortedCourses, notebook.entryname)
                  let p = null // temp promise usage for create or return resolve
                  if (item) {
                    p = that.createNavEntry(item.entryname, item.collabId, item.parentId, item.appId, item.newFileId)
                  } else {
                    console.debug(notebook.entryname + ' already exists')
                    p = Promise.resolve()
                  }
                  p.then(function (elem) {
                    that.setInitialNavItem(elem)
                    let notebook = that.moocUc.children[3].find(that.findNotebook)
                    if (notebook) {
                      let item = that.findEntryInStructure(unsortedCourses, notebook.entryname)
                      let p = null // temp promise usage for create or return resolve
                      if (item) {
                        p = that.createNavEntry(item.entryname, item.collabId, item.parentId, item.appId, item.newFileId)
                      } else {
                        console.debug(notebook.entryname + ' already exists')
                        p = Promise.resolve()
                      }
                      p.then(function (elem) {
                        that.setInitialNavItem(elem)
                        resolve()
                      }, reject)
                    }
                  }, reject)
                }
              }, reject)
            }
          }, reject)
        } // end of the callbacks
      })
    }
  }
}
