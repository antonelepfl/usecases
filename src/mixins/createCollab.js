import uuid from 'uuid4'
import typesCollabsApps from '../assets/config_files/types_collabs_apps.json'
import collabAuthentication from './collabAuthentication.js'
const FILE_API_URL = 'https://services.humanbrainproject.eu/document/v0/api/file/'
const COLLAB_API = 'https://services.humanbrainproject.eu/collab/v0/'
const COLLAB_HOME = 'https://collab.humanbrainproject.eu/#/collab/'
const COLLAB_STORAGE_API = 'https://services.humanbrainproject.eu/storage/v1/api/project/?collab_id='
const STORAGE_FILE_API = 'https://services.humanbrainproject.eu/storage/v1/api/file/'
const BSP_PUBLIC_REPO = 'https://github.com/lbologna/bsp_data_repository/raw/master/optimizations/'
const USER_API = 'https://services.humanbrainproject.eu/idm/v1/api/user/me'

export default {
  data () {
    return {
      errorMessage: '',
      typesCollabsApps: typesCollabsApps,
      header: {}
    }
  },
  mixins: [collabAuthentication],
  created () {
    let that = this
    this.getToken().then(function (token) {
      that.header = {headers: {'Authorization': token}}
    }) // from collabAuthentication
  },
  methods: {
    searchCollab (param) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(COLLAB_API + 'mycollabs/?search=' + param, that.header)
        .then(function (response) {
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
      })
    },
    createNavEntry (entryName, collabId, parentId, appId, fileId) {
      var that = this
      return new Promise(function (resolve, reject) {
        var context = uuid()
        var type = 'IT'
        var payload = {
          'app_id': appId,
          'context': context,
          'name': entryName,
          'order_index': '-1',
          'parent': parentId,
          'type': type
        }
        var collabReq = COLLAB_API + 'collab/' + collabId + '/nav/'
        that.$http.post(collabReq, payload, that.header) // create navitem
        .then(function (navItem) {
          let navitemId = navItem.body.id
          if (appId === that.typesCollabsApps.jupyternotebook.appid) { // is jupyter notebook
            that.fillJupyterNavItem(fileId, navitemId, collabId, context)
            .then(function () {
              console.debug('Nav entry created')
              resolve({'collabId': collabId, 'navitemId': navitemId})
            }, function (e) { console.error('Error in fillJupyterNavItem', e) })
          } else {
            console.debug('Nav entry created')
            resolve({'collabId': collabId, 'navitemId': navitemId})
          }
        }, function (error) { reject('Error to create NavItem:', error) })
      })
    },
    fillJupyterNavItem: function (fileId, navitemId, collabId, context) {
      var that = this
      return new Promise(function (resolve, reject) {
        let jupyterNotebookUrl = FILE_API_URL + fileId + '/metadata'
        var context2 = 'ctx_' + context
        var payload = {}
        payload[context2] = 1 // adding context to the entry
        that.$http.put(jupyterNotebookUrl, payload, that.header)
        .then(function (response) { // change the metadata jupyter file
          resolve();
        }, function (error) { reject('Error changing the metadata:', error) })
      })
    },
    createCollab (collabTitle, isPrivate) {
      var collabReq = COLLAB_API + 'collab/'
      var that = this
      var payload = {
        'title': collabTitle,
        'private': isPrivate,
        'content': collabTitle
      }
      return new Promise(function (resolve, reject) {
        that.$http.post(collabReq, payload, that.header).then(function (response) {
          console.debug('Collab created')
          var collabId = response.body
          resolve(collabId)
        }, function (error) {
          if (error.body.title[0] === 'collab with this title already exists.') {
            reject('Collab already exist')
          } else { reject(error) }
        })
      })
    },
    getNavRoot (collabId) {
      var url = COLLAB_API + 'collab/' + collabId + '/nav/root/'
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(url, that.header).then(function (response) {
          var parentRoot = response.body.id
          resolve({'root': parentRoot, 'collabId': collabId})
        }, function () { reject('Error obtaining the nav root') })
      })
    },
    getAllNav (collabId) {
      var url = COLLAB_API + 'collab/' + collabId + '/nav/root/'
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(url, that.header).then(function (response) {
          var nav = response.body
          resolve(nav)
        }, function (error) { reject(error) })
      })
    },
    redirectToCollab (collabId, navitemId) {
      window.parent.postMessage({
        eventName: 'location',
        data: {
          url: COLLAB_HOME + collabId + '/nav/' + navitemId
        }
      }, '*')
      setTimeout(function () {
        this.errorMessage = 'Collab created but not redirected (it is not embed)'
      }.bind(this), 1000)
    },
    getCollabStorage (collabId) {
      var url = COLLAB_STORAGE_API + collabId
      var that = this
      return new Promise(function (resolve, reject) {
        var newHeader = {headers: {
          'Authorization': that.header.headers.Authorization,
          'Accept': 'application/json'
        }}
        that.$http.get(url, newHeader).then(function (response) {
          console.debug('Collab storage obtained')
          resolve(response.body)
        })
      })
    },
    createFile (name, contentType, extension, parent) {
      var url = STORAGE_FILE_API
      var that = this
      var t = new Date() // to avoid conflicts with fileNames in collab storage
      var time = t.getMilliseconds().toString()
      var payload = {
        'name': name + time + extension,
        'content_type': contentType,
        'parent': parent
      }
      return new Promise(function (resolve, reject) {
        var newHeader = {headers: {
          'Authorization': that.header.headers.Authorization,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }}
        that.$http.post(url, payload, newHeader).then(function (response) {
          console.debug('File created')
          resolve(response.body)
        })
      })
    },
    copyFileContent (originFileId, newFileId) {
      var url = STORAGE_FILE_API + newFileId + '/content/'
      var that = this
      var newHeader = {headers: {
        'Authorization': this.header.headers.Authorization,
        'X-Copy-From': originFileId,
        'Accept': 'application/json'
      }}
      return new Promise(function (resolve, reject) {
        that.$http.put(url, null, newHeader).then(function (response) {
          console.debug('File content copied')
          resolve(newFileId)
        }, function (error) {
          console.error('Error copying the file content')
          reject(error)
        })
      })
    },
    generateNotebook (collabId, appInfo, parentNav) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.getCollabStorage(collabId)
        .then(function (projectStorage) {
          var parent = projectStorage.results[0].uuid
          var name = 'copy-' + appInfo.entryname
          return that.createFile(name, appInfo.contenttype, appInfo.extension, parent)
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
          var entryName = appInfo.entryname
          return that.createNavEntry(entryName, collabId, parentNav.id, appInfo.appid, newFileId)
        }, reject)
        .then(function (obj) {
          resolve(obj)
        }, reject)
      })
    },
    createItemInExistingCollab (collab, uc) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.getAllNav(collab.id).then(function (parentNav) {
          var ucInfo = that.typesCollabsApps[uc]
          var exists = {};
          if (ucInfo.appid) { // is only one item
            exists = that.checkExists(parentNav, ucInfo.appid, ucInfo.entryname)
          }
          if (!exists.found) { // does not exist or has children
            var promises = []
            if (ucInfo.children) {
              for (let i = 0; i < ucInfo.children.length; i++) {
                var item = ucInfo.children[i]
                exists = that.checkExists(parentNav, item.appid, item.entryname)
                if (!exists.found) {
                  if (item.appid === that.typesCollabsApps.jupyternotebook.appid) { // if is jupyter notebook
                    promises.push(that.generateNotebook(collab.id, item, parentNav))
                  } else { // is not jupyter notebok just connect to the original file
                    promises.push(that.createNavEntry(item.entryname, collab.id, parentNav.id, item.appid))
                  }
                }
              }
            } else { // is only one navitem
              if (ucInfo.appid === that.typesCollabsApps.jupyternotebook.appid) { // if is jupyter notebook
                promises.push(that.generateNotebook(collab.id, ucInfo, parentNav))
              } else { // is not jupyter notebok just connect to the original file
                promises.push(that.createNavEntry(ucInfo.entryname, collab.id, parentNav.id, ucInfo.appid))
              }
            }
            if (promises.length === 0) {
              console.debug('Existing apps in collab found')
              that.redirectToCollab(collab.id, exists.navitemId)
              resolve()
            } else {
              Promise.all(promises).then(function (generatedNotebooks) {
                let obj = generatedNotebooks[0]
                if (obj.collabId) {
                  that.redirectToCollab(obj.collabId, obj.navitemId)
                  resolve()
                }
              }, function (e) {
                console.error('Error creating multiple files in existing collab', e)
                reject(e)
              })
            }
          } else { // found
            console.debug('Existing app in collab found')
            that.redirectToCollab(collab.id, exists.navitemId)
            resolve()
          }
        }, reject)
      })
    },
    checkExists (nav, appId, appName) {
      if (nav.children) {
        let item = {'found': false, 'navitemId': 0}
        let i = 0
        while (!item.found && nav.children.length > i) {
          if (nav.children[i].app_id === appId.toString() &&
            nav.children[i].name === appName) {
            item.found = true
            item.navitemId = nav.children[i].id
          }
          i = i + 1
        }
        return item
      }
    },
    getFileContent (fileId) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(STORAGE_FILE_API + fileId + '/content/', that.header)
        .then(function (response) {
          resolve(response.body)
        },
        function (responseError) {
          reject(responseError)
        })
      })
    },
    setFileContent (fileId, content) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.post(STORAGE_FILE_API + fileId + '/content/upload/', content, that.header)
        .then(function (response) {
          resolve(fileId)
        },
        function (responseError) {
          reject(responseError)
        })
      })
    },
    getUserInfo () {
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(USER_API, that.header)
        .then(function (response) {
          resolve(response.body)
        },
        function (responseError) {
          reject(responseError)
        })
      })
    },
    replaceJupyterContentAndCopy (findString, replaceString, collabId, appInfo, parentNav) {
      var that = this
      return new Promise(function (resolve, reject) {
        var originalFileId = appInfo.file
        var replacedFileContent = ''
        if (!originalFileId) {
          console.error('No entry in typesCollabsApps.json')
          reject()
        }
        that.getFileContent(originalFileId)
        .then(function (fileContent) {
          replacedFileContent = fileContent.replace(findString, replaceString)
          return that.getCollabStorage(collabId)
        }, function (error) {
          reject(error)
        })
        .then(function (projectStorage) {
          var parent = projectStorage.results[0].uuid
          var name = 'replaced-'
          return that.createFile(name, appInfo.contenttype, appInfo.extension, parent)
        })
        .then(function (file) {
          return that.setFileContent(file.uuid, replacedFileContent)
        }, function (error) {
          reject(error)
        })
        .then(function (newFileId) {
          var entryName = appInfo.entryname
          return that.createNavEntry(entryName, collabId, parentNav.id, appInfo.appid, newFileId)
        }, function (error) {
          reject(error)
        })
        .then(function (obj) {
          resolve(obj)
        }, function (error) {
          reject(error)
        })
      })
    },
    createItemInExistingCollabWithReplace (collab, uc, morphology, findString) {
      var replaceString = BSP_PUBLIC_REPO + morphology + '/' + morphology + '.zip'
      var that = this
      return new Promise(function (resolve, reject) {
        that.getAllNav(collab.id).then(function (parentNav) {
          var ucInfo = that.typesCollabsApps[uc]
          var exists = {};
          ucInfo.entryname = ucInfo.entryname + ' - ' + morphology
          if (ucInfo.appid) { // is only one item
            exists = that.checkExists(parentNav, ucInfo.appid, ucInfo.entryname)
          }
          if (!exists.found) {
            var promises = []
            if (ucInfo.children) {
              for (let i = 0; i < ucInfo.children.length; i++) {
                var item = ucInfo.children[i]
                ucInfo.entryname = item.entryname + ' - ' + morphology
                exists = that.checkExists(parentNav, item.appid, ucInfo.entryname)
                if (!exists.found) {
                  if (item.appid === that.typesCollabsApps.jupyternotebook.appid) { // if is jupyter notebook
                    promises.push(that.replaceJupyterContentAndCopy(findString, replaceString, collab.id, item, parentNav))
                  } else { // is not jupyter notebok just connect to the original file
                    promises.push(that.createNavEntry(ucInfo.entryname, collab.id, parentNav.id, item.appid))
                  }
                }
              }
            } else { // is only one navitem
              if (ucInfo.appid === that.typesCollabsApps.jupyternotebook.appid) { // if is jupyter notebook
                promises.push(that.replaceJupyterContentAndCopy(findString, replaceString, collab.id, ucInfo, parentNav))
              } else { // is not jupyter notebok just connect to the original file
                promises.push(that.createNavEntry(ucInfo.entryname, collab.id, parentNav.id, ucInfo.appid))
              }
            }
            Promise.all(promises).then(function (generatedNotebooks) {
              let obj = generatedNotebooks[0]
              if (obj.collabId) {
                that.redirectToCollab(obj.collabId, obj.navitemId)
                resolve()
              }
            }, function (e) {
              console.error('Error creating multiple files in existing collab')
              reject(e)
            })
          } else { // found
            console.debug('Existing app in collab found')
            that.redirectToCollab(collab.id, exists.navitemId)
            resolve()
          }
        }, function (error) {
          console.error(error)
          reject(error)
        })
      })
    }
  }
}
