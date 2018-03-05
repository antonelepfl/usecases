
import createCollab from 'mixins/createCollab.js'
import collabAuthentication from 'mixins/collabAuthentication.js'
import findIndex from 'lodash/findIndex'
import find from 'lodash/find'
import usecases from 'assets/config_files/usecases.json'

export default {
  data () {
    return {
      circuitBuilding: usecases[0].circuitbuilding
    }
  },
  mixins: [collabAuthentication, createCollab],
  methods: {
    createItemInExistingCollabCircuitBuilding (collab, uc, model) {
      let ucInfo = this.getCBUsecaseInfo(uc, model)
      var that = this
      return new Promise(function (resolve, reject) {
        if (ucInfo === undefined) {
          reject('No usecase named:', uc)
        } else {
          var tempPromise = null
          tempPromise = that.createMultipleItemsInExistingCollab(collab, ucInfo)
          tempPromise.then(function (promises) {
            Promise.all(promises)
            .then(function (elements) {
              let obj = elements[0]
              if (obj.collabId) {
                that.redirectToCollab(obj.collabId, obj.navitemId)
                resolve()
              }
            }, reject)
          })
        }
      })
    },
    uglyfy (name) {
      return name.split(' ').map(function (word) {
        return word.toLowerCase()
      }).join('')
    },
    getModelName (modelName) {
      if (modelName) {
        let modelInfo = find(this.circuitBuilding, (elem) => {
          return this.uglyfy(elem.title) === this.uc_name
        })
        return modelInfo.title
      }
    },
    getCBUsecaseInfo (uc, model) {
      function compact (name) {
        return name.toLowerCase().replace(/ /g, '')
      }
      let categoryInfo = find(this.circuitBuilding, (category) => {
        return compact(category.title) === uc
      })
      let index = findIndex(categoryInfo.models, function (m) {
        return compact(m.title) === model
      })
      return categoryInfo.models[index]
    }
  }
}
