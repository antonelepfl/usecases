
/* eslint-disable no-console */
import uuid from 'uuid4'
import collabAuthentication from './collabAuthentication.js'
import usecases from '@/assets/config_files/usecases.json'
import { getUsecaseInfo, replaceConfirmation } from '@/mixins/utils.js'
import store from '@/mixins/store.js'
const COLLAB_API = 'https://services.humanbrainproject.eu/collab/v0/'
const COLLAB_HOME = 'https://collab.humanbrainproject.eu/#/collab/'
const COLLAB_STORAGE_API = 'https://services.humanbrainproject.eu/storage/v1/api/project/?collab_id='
const STORAGE_FILE_API = 'https://services.humanbrainproject.eu/storage/v1/api/file/'
const USER_API = 'https://services.humanbrainproject.eu/idm/v1/api/user/me'
const FOLDER_ENDPOINT = 'https://services.humanbrainproject.eu/storage/v1/api/folder/'
const STORAGE_BY_QUERY_PARAM = 'https://services.humanbrainproject.eu/storage/v1/api/entity/'
const JUPYTER_NOTEBOOK_APP_ID = 175

export default {
  data () {
    return {
      errorMessage: '',
      usecases: usecases[0],
      header: store.state.header,
      userInfo: null
    }
  },
  mixins: [collabAuthentication],
  methods: {
    searchCollab (param) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(COLLAB_API + 'mycollabs/?search=' + param, that.header)
        .then(function (response) {
          if (param.length > 0) {
            resolve(response.data.results)
          }
        },
        function (error) {
          if (error.response.status === 401) {
            that.renewToken() // force renew token
            reject(error)
          } else {
            reject(error)
          }
        })
      })
    },
    createNavEntry (entryName, collabId, parentId, appId, fileId, order) {
      let that = this
      return new Promise(function (resolve, reject) {
        let request = null
        if (store.state.allNavItems && store.state.rewriteFiles) {
          /* replace is active so try to resuse the navitem if exists */
          request = tryToFindExisting()
        } else { request = generateRequest() }

        request.then(function (navItem) {
          let navitemId = navItem.data.id
          let context = navItem.data.context
          if (appId === JUPYTER_NOTEBOOK_APP_ID) {
            that.fillJupyterNavItem(fileId, navitemId, collabId, context)
            .then(function () {
              console.debug('Nav entry created')
              resolve({'collabId': collabId, 'navitemId': navitemId, 'entryName': entryName})
            }, function (e) {
              console.error('Error in fillJupyterNavItem')
              reject(e)
            })
          } else {
            console.debug('Nav entry created')
            resolve({'collabId': collabId, 'navitemId': navitemId})
          }
        }, function (error) { reject('Error to create NavItem:', error) })
      })

      function generateRequest () {
        let context = uuid()
        let navOrder = order || '-1'
        let type = 'IT'
        let payload = {
          'app_id': appId,
          'context': context,
          'name': entryName,
          'order_index': navOrder,
          'parent': parentId,
          'type': type
        }
        let collabReq = COLLAB_API + 'collab/' + collabId + '/nav/'
        return that.$http.post(collabReq, payload, that.header) // create navitem
      }

      function tryToFindExisting () {
        let request = null
        let found = store.state.allNavItems.children.find((nav) => {
          return nav.name === entryName
        })
        if (found) {
          request = Promise.resolve({'data': found})
          console.debug('Reusing existing nav item')
        } else {
          request = generateRequest()
        }
        return request
      }
    },
    fillJupyterNavItem: function (fileId, navitemId, collabId, context) {
      var that = this
      return new Promise(function (resolve, reject) {
        let jupyterNotebookUrl = STORAGE_FILE_API + fileId + '/metadata/'
        var context2 = 'ctx_' + context
        var payload = {}
        payload[context2] = 1 // adding context to the entry
        that.$http.put(jupyterNotebookUrl, payload, that.header)
        .then(() => { // change the metadata jupyter file
          console.debug('Change metadata file <-> navitem')
          resolve();
        }, (error) => {
          reject('Error changing the metadata:', error)
        })
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
          var collabId = response.data
          resolve(collabId)
        }, function (error) {
          if (error.response.data && error.response.data.title &&
            error.response.data.title[0] === 'collab with this title already exists.') {
            reject('Collab already exist')
          } else if (error.response.data && error.response.data.detail) {
            reject(error.response.data.detail)
          } else { reject(error) }
        })
      })
    },
    getNavRoot (collabId) {
      var url = COLLAB_API + 'collab/' + collabId + '/nav/root/'
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(url, that.header).then(function (response) {
          var parentRoot = response.data.id
          let nav = {'root': parentRoot, 'collabId': collabId}
          console.debug('Get nav root obtained')
          resolve(nav)
        }, function () { reject('Error obtaining the nav root') })
      })
    },
    getAllNav (collabId) {
      var url = COLLAB_API + 'collab/' + collabId + '/nav/root/'
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(url, that.header).then(function (response) {
          var nav = response.data
          console.debug('Get all nav obtained')
          store.setAllNavItems(nav)
          resolve(nav)
        }, function () { reject('Error get nav root') })
      })
    },
    redirectToCollab (collabId, navitemId) {
      var path = ''
      if (navitemId) {
        path = COLLAB_HOME + collabId + '/nav/' + navitemId
      } else {
        path = COLLAB_HOME + collabId
      }
      console.log('Redirecting to ', path)
      // reset the variables
      store.setRewriteFiles(false)
      store.setAllNavItems({})
      if (window !== window.top) {
        // inside iframe
        window.parent.postMessage({
          eventName: 'location',
          data: {
            url: path
          }
        }, '*')
      } else {
        window.location.href = path;
      }
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
          resolve(response.data)
          store.setCollabInfo(response.data.results[0])
        }, reject)
      })
    },
    getFileByName (collabId, fileName) {
      var url = STORAGE_BY_QUERY_PARAM + '?path=/' + collabId + '/' + fileName
      var that = this
      return new Promise(function (resolve, reject) {
        var newHeader = {headers: {
          'Authorization': that.header.headers.Authorization,
          'Accept': 'application/json'
        }}
        that.$http.get(url, newHeader).then(function (response) {
          console.debug('File by name retrieved')
          resolve(response.data)
        }, reject)
      })
    },
    getFileByEnv (info) {
      if (store.state.devWebsite) {
        return info.file;
      }
      return info.file_prod || info.file;
    },
    createFile (name, contentType, extension, parent, collabId) {
      var url = STORAGE_FILE_API
      var that = this
      var payload = {
        'name': name + extension,
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
          resolve(response.data)
        }, function (error) {
          let errorMessage = error.response.data[0]
          if (errorMessage && errorMessage.startsWith('File with the same name')) {
            // get the id of the existing file
            if (collabId) {
              that.getFileByName(collabId, name + extension)
              .then(function (file) {
                file.exists = true
                resolve(file)
              }, () => {
                reject('Error creating a file')
              })
            }
          } else {
            reject('Error creating a file', error)
          }
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
        that.$http.put(url, null, newHeader).then(() => {
          console.debug('File content copied')
          resolve(newFileId)
        }, function (e) {
          console.error('Error copying the file content', e)
          reject('Error copying the file: ' + originFileId)
        })
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
          var name = appInfo.entryname
          return that.createFile(name, appInfo.contenttype, appInfo.extension, parent, collabId)
        })
        .then(function (file) {
          return that.copyFileContent(that.getFileByEnv(appInfo), file.uuid)
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
    createItemInExistingCollab (collab, uc, ucInfo) {
      if (!ucInfo) { ucInfo = getUsecaseInfo(uc) }
      var that = this
      return new Promise(function (resolve, reject) {
        if (ucInfo === undefined) {
          reject('No usecase named:', uc)
        } else {
          var tempPromise = null // to avoid code duplication
          tempPromise = that.createMultipleItemsInExistingCollab(collab, ucInfo)
          tempPromise.then(function (promises) {
            Promise.all(promises)
            .then(function (elements) {
              let obj = elements[0]
              if (obj.collabId) {
                that.redirectToCollab(obj.collabId, obj.navitemId)
                resolve()
              }
            })
          })
          .catch((error) => {
            that.abortAndRedirect(collab, ucInfo, error, reject)
          })
        }
      })
    },
    createMultipleItemsInExistingCollab (collab, ucInfo) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.getAllNav(collab.id).then((parentNav) => {
          var promises = []
          that.replaceExistsDialog(parentNav, ucInfo.files)
          .then((isReplace) => {
            ucInfo.files.forEach((item) => {
              if (!isReplace) { // no replace. generate new navitem and new file
                throw String('abort and redirect')
              } // otherwise create = replace
              if (item.appid === JUPYTER_NOTEBOOK_APP_ID) {
                promises.push(that.generateNotebook(collab.id, item, parentNav))
              } else { // is not jupyter notebok just connect to the original file
                promises.push(that.createNavEntry(item.entryname, collab.id, parentNav.id, item.appid))
              }
            })
            resolve(promises)
          })
          .catch((error) => {
            reject(error)
          })
        })
      })
    },
    checkExists (nav, appId, appName) {
      if (nav.children) {
        let item = {'found': false, 'navitemId': undefined}
        let i = 0
        while (!item.found && nav.children.length > i) {
          if (nav.children[i].app_id === appId.toString() &&
            nav.children[i].name === appName) {
            item.found = true
            item.entryname = appName
            item.navitemId = nav.children[i].id
            item.navitemContext = nav.children[i].context
          }
          i = i + 1
        }
        return item
      }
    },
    replaceExistsDialog (nav, filesChildren) {
      /* find the same name of the existing navs and new files
       * if finds a popup will apear to the user for replace or generate new files
      **/
      let promise = null
      let found = null
      if (nav.children && nav.children.length > 0) {
        if (Array.isArray(filesChildren)) {
          found = filesChildren.find((file) => {
            return nav.children.find((navitem) => {
              return (file.entryname === navitem.name)
            })
          })
        } else {
          found = nav.children.find((navitem) => {
            return (filesChildren.entryname === navitem.name)
          })
        }

        if (found && !store.state.rewriteFiles) {
          promise = replaceConfirmation()
        } else {
          console.debug('Not item found. creating from scratch')
          promise = Promise.resolve(true)
        }
      }

      if (!promise) { throw Error('Replace Exists Dialog') }
      return promise.then((isReplace = false) => {
        store.setRewriteFiles(isReplace)
        return isReplace || false
      })
    },
    findInitialInNavitems (nav, filesChildren) {
      /* find the initial navitem in the existings navitems **/
      if (nav.children && nav.children.length > 0) {
        let filesChildrenIsArray = Array.isArray(filesChildren)
        let initialName = null
        if (filesChildrenIsArray && filesChildren.length > 1) {
          initialName = filesChildren.find((file) => {
            return (file.initial)
          })
          if (initialName) {
            initialName = initialName.entryname
          } else {
            console.warn('No initial was set in usecases.json')
          }
        } else {
          initialName = filesChildren.entryname || filesChildren[0].entryname
        }

        let found = nav.children.find((navitem) => {
          return (initialName === navitem.name)
        })
        if (found) {
          console.debug('Initial Navitem found', found.name)
          return found.id
        }
      }
      return null
    },
    getFileContent (fileId) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(STORAGE_FILE_API + fileId + '/content/', that.header)
        .then(function (response) {
          resolve(response.data)
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
        .then(function () {
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
        if (that.userInfo !== null) {
          resolve(that.userInfo)
        } else {
          that.$http.get(USER_API, that.header)
          .then(function (response) {
            that.userInfo = response.data
            resolve(response.data)
          },
          function (error) {
            if (error.response.status === 401) {
              that.renewToken(true) // force renew token
              reject(error)
            } else {
              reject(error)
            }
          })
        }
      })
    },
    createFolder (name, parentId, collabId) {
      var that = this
      var payload = {
        'name': name,
        'parent': parentId
      }
      return new Promise(function (resolve, reject) {
        that.$http.post(FOLDER_ENDPOINT, payload, that.header)
        .then(function (folder) {
          console.debug('Folder created')
          resolve(folder.data)
        },
        function (e) {
          console.error('Error creating folder. Folder already exists?', e)
          if (collabId) {
            that.getFileByName(collabId, name)
            .then(function (file) {
              resolve(file)
            }, function () {
              reject('Error creating a file')
            })
          }
        })
      })
    },
    replaceContentAndCopy (findString, replaceString, collabId, appInfo, parentNav) {
      /* this function takes a string and replace for another inside a file the content of the app
      into new app and create a navitem for that file */
      var that = this
      return new Promise(function (resolve, reject) {
        var replacedFileContent = ''
        that.getFileContent(that.getFileByEnv(appInfo))
        .then(function (fileContent) {
          replacedFileContent = JSON.stringify(fileContent)
          replacedFileContent = replacedFileContent.replace(findString, replaceString)
          return that.getCollabStorage(collabId)
        }, reject)
        .then(function (projectStorage) {
          var parent = projectStorage.results[0].uuid
          var name = 'replaced-' + appInfo.entryname
          return that.createFile(name, appInfo.contenttype, appInfo.extension, parent, collabId)
        })
        .then(function (file) {
          return that.setFileContent(file.uuid, replacedFileContent)
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
    createItemInExistingCollabWithReplace (collab, uc, modelName, findString) {
      var that = this
      let ucInfo = getUsecaseInfo(uc)
      return new Promise(function (resolve, reject) {
        that.getAllNav(collab.id).then(function (parentNav) {
          var promises = []
          if (ucInfo === undefined) {
            return reject('No usecase named:', uc)
          }
          that.replaceExistsDialog(parentNav, ucInfo.files)
          .then((isReplace) => {
            ucInfo.files.forEach((item) => {
              if (!isReplace) { // no replace. generate new navitem and new file
                throw String('abort and redirect')
              } // otherwise create = replace
              if (item.appid === JUPYTER_NOTEBOOK_APP_ID) {
                promises.push(that.replaceContentAndCopy(findString, modelName, collab.id, item, parentNav))
              } else { // is not jupyter notebok just connect to the original file
                promises.push(that.createNavEntry(item.entryname, collab.id, parentNav.id, item.appid))
              }
            })
            Promise.all(promises).then(function (generatedNotebooks) {
              let obj = generatedNotebooks[0]
              if (obj === undefined) {
                that.redirectToCollab(collab.id)
                resolve('Apps already in the collab')
              } else if (obj && obj.collabId) {
                that.redirectToCollab(obj.collabId, obj.navitemId)
                resolve()
              }
            })
          })
          .catch((error) => {
            that.abortAndRedirect(collab, ucInfo, error, reject)
          })
        })
      })
    },
    sendStatistics (collabId, ucName, category, fullModelName, isNew) {
      if (store.state.devWebsite) {return}
      let that = this
      function searchPath (ucName) {
        for (let i in that.usecases) {
          for (let j in that.usecases[i]) {
            let title = that.usecases[i][j].title
            let titleCompressed = title.replace(/ /g, '').toLowerCase()
            if (titleCompressed === ucName) {
              return title
            }
          }
        }
        return ucName
      }
      let fullUCName = searchPath(ucName)
      let userEntry = 'entry.1933333390'
      /* eslint no-undef: 0 */
      let formData = new URLSearchParams()
      let url = 'https://docs.google.com/forms/d/e/1FAIpQLSc6u9NerFcvI_4Duh1N4LyV48pDi8Mjq0xYGWJzOPBaJ9FjWw/formResponse'
      let collabCreated = (isNew) ? 'Create' : 'Add'
      formData.append('entry.724323063', collabCreated)
      formData.append('entry.1219332324', fullUCName)
      formData.append('entry.2088231351', fullModelName)
      formData.append('entry.748800890', collabId)
      formData.append('entry.2065854000', category)
      console.debug('Send usage statistic to form')
      this.sendToForm(formData, url, userEntry)
    },
    sendToForm (formData, url, userEntry) {
      let that = this

      if ('requestIdleCallback' in window) {
        requestIdleCallback(function () {
          getInfoAndSend()
        }, { timeout: 1000 });
      } else {
        getInfoAndSend()
      }

      function getInfoAndSend () {
        that.getUserInfo().then(function (user) {
          formData.append(userEntry, user.id)
          if (!store.state.devWebsite) {
            send()
          }
        })
      }

      function send () {
        let options = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
        that.$http.post(url, formData.toString(), options)
        .then(function () {}, function () {})
      }
    },
    sendAcceptTerms (choice) {
      /* eslint no-undef: 0 */
      let formData = new URLSearchParams()
      let url = 'https://docs.google.com/forms/u/1/d/e/1FAIpQLSdd8gMoS5Ki-3o9cdqwmqU9-wgtzMGNKusamSoK-L3wsQPWnA/formResponse'
      let userEntry = 'entry.974372560'
      formData.append('entry.1853154584', choice)
      console.debug('Send acceptance Terms & Conditions to form')
      this.sendToForm(formData, url, userEntry)
    },
    getDataRepo (url) {
      if (!url.includes('://')) {
        url = decodeURIComponent(url);
      }
      let that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(url).then(function (content) {
          resolve(content.data)
        }, reject)
      })
    },
    addCollabMemeber (collabId, userId) {
      let that = this
      return new Promise(function (resolve, reject) {
        let url = COLLAB_API + 'collab/' + collabId + '/team/'
        let payload = {'users': [userId]}
        that.$http.put(url, payload, that.header).then(function (team) {
          resolve(team)
        }, reject)
      })
    },
    abortAndRedirect (collab, ucInfo, error, reject) {
      if (error === 'abort and redirect') {
        console.debug('Do not replace. Redirect to collab')
        let initialNavId = this.findInitialInNavitems(store.state.allNavItems, ucInfo.files)
        this.redirectToCollab(collab.id, initialNavId)
        this.isLoading = false
        return
      }
      console.error('Error creating multiple files in existing collab with replace')
      if (!reject) throw Error(error)
      reject(error)
    }
  }
}
