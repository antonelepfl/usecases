import uuid from 'uuid4'

export default {
  data () {
    return {
      collabAPI: 'https://services.humanbrainproject.eu/collab/v0/',
      isLoading: false,
      errorMessage: '',
      isJupyter: false
    }
  },
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
        if (appId === 175) { // is jupyter notebook
          // TODO: take as a configuration file
          var jupyterNotebookUrl = 'https://services.humanbrainproject.eu/document/v0/api/file/b652c8ed-45d2-4ee2-8211-cd90050cf167/metadata'
          var context2 = 'ctx_' + context
          var payload = {}
          payload[context2] = 1
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
    redirectToCollab (collabId) {
      window.parent.postMessage({
        eventName: 'collab.open',
        data: {
          id: collabId
        }
      }, '*');
      this.errorMessage = 'Collab created but not redirected (it is not embed)'
    }
  }
}
