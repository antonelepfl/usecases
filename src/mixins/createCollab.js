import uuid from 'uuid4'
import jupyterNotebookUrls from '../assets/config_files/jupyter_notebooks_urls.json'
import typesCollabsApps from '../assets/config_files/types_collabs_apps.json'
import CollabAuthentication from './collabAuthentication.js'
const FILE_URL = 'https://services.humanbrainproject.eu/document/v0/api/file/'

export default {
  data () {
    return {
      collabAPI: 'https://services.humanbrainproject.eu/collab/v0/',
      isLoading: false,
      errorMessage: '',
      isJupyter: false,
      typesCollabsApps: typesCollabsApps,
      header: {}
    }
  },
  props: ['uc_name'],
  mixins: [CollabAuthentication],
  created () {
    let that = this
    this.getToken().then(function (token) {
      that.header = {headers: {'Authorization': token}}
    }) // from CollabAuthentication
  },
  methods: {
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
        var collabReq = that.collabAPI + 'collab/' + collabId + '/nav/'

        that.$http.post(collabReq, payload, that.header).then(function (response) {
          let navitemId = response.body.id
          if (appId === that.typesCollabsApps.jupyternotebook.appid) { // is jupyter notebook
            let jupyterNotebookUrl = FILE_URL + fileId + '/metadata'
            var context2 = 'ctx_' + context
            var payload = {}
            payload[context2] = 1 // adding context to the entry
            that.$http.put(jupyterNotebookUrl, payload, that.header).then(function (response) {
              console.debug('Nav entry created')
              that.redirectToCollab(collabId, navitemId)
              resolve();
            }, function (error) {
              console.error('Error changing the metadata to the file:', fileId)
              console.error(error)
              reject()
            })
          } else {
            console.debug('Nav entry created')
            that.redirectToCollab(collabId, navitemId)
            resolve()
          }
        })
      })
    },
    createCollab (collabTitle, isPrivate) {
      var collabReq = this.collabAPI + 'collab/'
      var that = this
      var payload = {
        'title': collabTitle,
        'private': isPrivate,
        'content': collabTitle
      }
      return new Promise(function (resolve, reject) {
        that.$http.post(collabReq, payload, that.header).then(function (response) {
          console.debug('Collab created')
          var collabId = response.body.id
          resolve(collabId)
        }, function (error) {
          reject(error)
        })
      })
    },
    getNavRoot (collabId) {
      var url = this.collabAPI + 'collab/' + collabId + '/nav/root/'
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(url, that.header).then(function (response) {
          var parentRoot = response.body.id
          resolve({'root': parentRoot, 'collabId': collabId})
        })
      })
    },
    getAllNav (collabId) {
      var url = this.collabAPI + 'collab/' + collabId + '/nav/root/'
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(url, that.header).then(function (response) {
          var nav = response.body
          resolve(nav)
        })
      })
    },
    redirectToCollab (collabId, navitemId) {
      window.parent.postMessage({
        eventName: 'location',
        data: {
          url: 'https://collab.humanbrainproject.eu/#/collab/' + collabId + '/nav/' + navitemId
        }
      }, '*')
      setTimeout(function () {
        this.errorMessage = 'Collab created but not redirected (it is not embed)'
      }.bind(this), 1000)
    },
    getCollabStorage (collabId) {
      var url = 'https://services.humanbrainproject.eu/storage/v1/api/project/?collab_id=' + collabId
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
      var url = 'https://services.humanbrainproject.eu/storage/v1/api/file/'
      var that = this
      var payload = {
        'name': name + uuid() + extension,
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
        }, function (error) {
          reject(error)
        })
      })
    },
    copyFileContent (originFileId, newFileId) {
      var url = 'https://services.humanbrainproject.eu/storage/v1/api/file/' + newFileId + '/content/'
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
          reject(error)
        })
      })
    },
    generateNotebook (collab, collabApp, parentNav) {
      var that = this
      return new Promise(function (resolve, reject) {
        that.getCollabStorage(collab.id)
        .then(function (projectStorage) {
          var parent = projectStorage.results[0].uuid
          var name = 'test-'
          return that.createFile(name, collabApp.contenttype, collabApp.extension, parent)
        })
        .then(function (file) {
          var originalFileId = jupyterNotebookUrls[that.uc_name]
          if (!originalFileId) {
            console.error('No entry in jupyter_notebooks_url.json')
          }
          return that.copyFileContent(originalFileId, file.uuid)
        })
        .then(function (newFileId) {
          var entryName = collabApp.entryname
          return that.createNavEntry(entryName, collab.id, parentNav.id, collabApp.appid, newFileId)
        })
        .then(function () {
          resolve()
        }, function (error) {
          reject(error)
        })
      })
    }
  }
}
