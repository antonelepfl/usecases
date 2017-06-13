import createCollab from 'mixins/createCollab.js'
import collabAuthentication from 'mixins/collabAuthentication.js'
import typesCollabsApps from 'assets/config_files/types_collabs_apps.json'
import uuid from 'uuid4'
const COLLAB_API = 'https://services.humanbrainproject.eu/collab/v0/'
export default {
  mixins: [collabAuthentication, createCollab],
  data: function () {
    return {
      navitemId: null,
      moocUc: null,
      initialEntryName: null,
      parent: null,
      parentNav: null
    }
  },
  methods: {
    generateFiles (collabId, appInfo, parentNav) { // modified version.
      // it returns objects that has to be created in the navitem
      var that = this
      return new Promise(function (resolve, reject) {
        that.createFile(appInfo.entryname, appInfo.contenttype, appInfo.extension, that.parent, collabId)
        .then(function (file) {
          var originalFileId = appInfo.file
          if (!originalFileId) {
            console.error('No entry in typesCollabsApps.json')
            return reject('No entry in typesCollabsApps.json')
          }
          if (file.exists) {
            return Promise.resolve(file.uuid)
          } else {
            return that.copyFileContent(originalFileId, file.uuid)
          }
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
          resolve(collab)
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
        that.getNavElement(collab.id).then(function () {
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
            .then(function (emptyNavItemsId) {
              let prom = []
              for (let item in emptyNavItemsId) {
                prom.push(that.copyContentToNav(emptyNavItemsId[item]))
              }
              Promise.all(prom).then(function () { // populate navitem parallel
                that.collabCreationProgress = that.collabCreationProgress + 20
                if (that.navitemId) {
                  that.redirectToCollab(collab.id, that.navitemId)
                  setTimeout(resolve, 1500)
                  return
                }
                that.redirectToCollab(collab.id)
                setTimeout(resolve, 1500)
              })
            })
          }
        }, reject)
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
          var exists = {};
          var promises = []
          for (let i = 0; i < ucInfo.length; i++) {
            var item = ucInfo[i]
            exists = that.checkExists(that.parentNav, item.appid, item.entryname)
            if (!exists.found) {
              promises.push(that.generateFiles(collab.id, item, that.parentNav))
            } else {
              if (that.navitemId === null && item.initial) {
                that.navitemId = exists.navitemId
              }
              promises.push(Promise.resolve(exists))
            }
          }
          if (promises.length === 0) {
            exists['collabId'] = collab.id
            resolve([exists])
          } else {
            Promise.all(promises).then(resolve)
          }
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
    setInitialNavItem (elem) { // add into the global variable the initial item to be redirected
      if (this.navitemId == null && this.initialEntryName === elem.entryName) {
        this.navitemId = elem.navitemId
      }
    },
    generateNavItems (unsortedCourses) {
      let that = this
      return new Promise(function (resolve, reject) {
        // let promiseArray = []
        // for (let i = 0; i < unsortedCourses.length; i++) {
        //   let order = i + 1
        //   let notebook = that.moocUc.children[i].find(that.findNotebook)
        //   if (notebook) {
        //     let item = that.findEntryInStructure(unsortedCourses, notebook.entryname)
        //     // local createNavEntry function creates nav items in parallel
        //     promiseArray.push(that.createNavEntry(item.entryname, item.collabId, item.parentId, item.appId, item.newFileId, order))
        //   }
        // }
        // Promise.all(promiseArray).then(function (elem) {
        //   promiseArray = []
        //   for (let i = 0; i < elem.length; i++) {
        //     that.copyContentToNav(fileId, navitemId, collabId, context, entryName)
        //   }
        //   console.log(elem)
        //   if (that.navitemId == null && that.initialEntryName === elem.entryName) {
        //     that.navitemId = elem.navitemId
        //   }
        // })

        // TOOD convert this in parallel when collab order works
        let notebook = that.moocUc.children[0].find(that.findNotebook)
        let navItemsIdOrdered = []
        if (notebook) {
          let item = that.findEntryInStructure(unsortedCourses, notebook.entryname)
          let p = null
          if (item && !item.found) {
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
              if (item && !item.found) {
                p = that.createNavEntry(item.entryname, item.collabId, item.parentId, item.appId, item.newFileId)
              } else {
                console.debug(notebook.entryname + ' already exists')
                p = Promise.resolve()
              }
              if (elem) { navItemsIdOrdered.push(elem) }
              p.then(function (elem) {
                that.setInitialNavItem(elem)
                let notebook = that.moocUc.children[2].find(that.findNotebook)
                if (notebook) {
                  let item = that.findEntryInStructure(unsortedCourses, notebook.entryname)
                  let p = null // temp promise usage for create or return resolve
                  if (item && !item.found) {
                    p = that.createNavEntry(item.entryname, item.collabId, item.parentId, item.appId, item.newFileId)
                  } else {
                    console.debug(notebook.entryname + ' already exists')
                    p = Promise.resolve()
                  }
                  if (elem) { navItemsIdOrdered.push(elem) }
                  p.then(function (elem) {
                    that.setInitialNavItem(elem)
                    let notebook = that.moocUc.children[3].find(that.findNotebook)
                    if (notebook) {
                      let item = that.findEntryInStructure(unsortedCourses, notebook.entryname)
                      let p = null // temp promise usage for create or return resolve
                      if (item && !item.found) {
                        p = that.createNavEntry(item.entryname, item.collabId, item.parentId, item.appId, item.newFileId)
                      } else {
                        console.debug(notebook.entryname + ' already exists')
                        p = Promise.resolve()
                      }
                      if (elem) { navItemsIdOrdered.push(elem) }
                      p.then(function (elem) {
                        that.setInitialNavItem(elem)
                        if (elem) { navItemsIdOrdered.push(elem) }
                        resolve(navItemsIdOrdered)
                      }, reject)
                    }
                  }, reject)
                }
              }, reject)
            }
          }, reject)
        } // end of the callbacks
      })
    },
    getNavElement (collabId) {
      let that = this
      return new Promise(function (resolve, reject) {
        Promise.all([
          that.getCollabStorage(collabId),
          that.getAllNav(collabId)
        ]).then(function (elems) {
          that.parent = elems[0].results[0].uuid
          that.parentNav = elems[1]
          resolve()
        }, reject)
      })
    },
    createNavEntry (entryName, collabId, parentId, appId, fileId, order) {
      var that = this
      return new Promise(function (resolve, reject) {
        var context = uuid()
        var navOrder = order || -1
        var type = 'IT'
        var payload = {
          'app_id': appId,
          'context': context,
          'name': entryName,
          'order_index': navOrder,
          'parent': parentId,
          'type': type
        }
        var collabReq = COLLAB_API + 'collab/' + collabId + '/nav/'
        that.$http.post(collabReq, payload, that.header) // create navitem
        .then(function (navItem) {
          let navInfo = { // info to populate the navitem
            'fileId': fileId,
            'navitemId': navItem.body.id,
            'collabId': collabId,
            'context': context,
            'entryName': entryName
          }
          resolve(navInfo)
        }, function (error) { reject('Error to create NavItem:', error) })
      })
    },
    copyContentToNav (navInfo) {
      let that = this
      return new Promise(function (resolve, reject) {
        that.fillJupyterNavItem(navInfo.fileId, navInfo.navitemId, navInfo.collabId, navInfo.context)
        .then(function () {
          console.debug('Nav entry created')
          resolve({'collabId': navInfo.collabId, 'navitemId': navInfo.navitemId, 'entryName': navInfo.entryName})
        }, function (e) {
          console.error('Error in fillJupyterNavItem')
          reject(e)
        })
      })
    }
  }
}
