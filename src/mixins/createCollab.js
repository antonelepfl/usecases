import uuid from 'uuid4'
import jupyterNotebookUrls from '../assets/config_files/jupyter_notebooks_urls.json'
import typesCollabsApps from '../assets/config_files/types_collabs_apps.json'

export default {
  data () {
    return {
      collabAPI: 'https://services.humanbrainproject.eu/collab/v0/',
      isLoading: false,
      errorMessage: '',
      isJupyter: false,
      typesCollabsApps: typesCollabsApps
    }
  },
  props: ['uc_name'],
  methods: {
    createNavEntry (entryName, collabId, parentId, appId) {
      var context = uuid()
      var that = this
      var type = 'IT'
      var payload = {
        'app_id': appId,
        'context': context,
        'name': entryName,
        'order_index': 1,
        'parent': parentId,
        'type': type
      }
      var collabReq = this.collabAPI + 'collab/' + collabId + '/nav/'
      this.$http.post(collabReq, payload).then(function (response) {
        console.debug('Nav entry created')
        if (appId === that.typesCollabsApps.jupyternotebook.appid) { // is jupyter notebook
          var jupyterNotebookUrl = jupyterNotebookUrls[that.uc_name]
          var context2 = 'ctx_' + context
          var payload = {}
          payload[context2] = 1 // adding context to the entry
          that.$http.post(jupyterNotebookUrl, payload).then(function (response) {
            that.getNavRoot(collabId).then(function (parentRoot) { // to show the lasts added because cache problem
              that.redirectToCollab(collabId)
            })
          })
        } else {
          that.getNavRoot(collabId).then(function (parentRoot) { // to show the lasts added because cache problem
            that.redirectToCollab(collabId)
          })
        }
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
        that.$http.post(collabReq, payload).then(function (response) {
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
        that.$http.get(url).then(function (response) {
          var parentRoot = response.body.id
          resolve(parentRoot)
        })
      })
    },
    getAllNav (collabId) {
      var url = this.collabAPI + 'collab/' + collabId + '/nav/root/'
      var that = this
      return new Promise(function (resolve, reject) {
        that.$http.get(url).then(function (response) {
          var nav = response.body
          resolve(nav)
        })
      })
    },
    redirectToCollab (collabId) {
      window.parent.postMessage({
        eventName: 'collab.open',
        data: {
          id: collabId
        }
      }, '*')
      window.parent.postMessage({
        eventName: 'navigation.reload'
      }, '*')
      setTimeout(function () {
        this.errorMessage = 'Collab created but not redirected (it is not embed)'
      }.bind(this), 1000)
    }
  }
}
