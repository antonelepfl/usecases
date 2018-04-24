
import createCollab from '@/mixins/createCollab.js'
import collabAuthentication from '@/mixins/collabAuthentication.js'
import findIndex from 'lodash/findIndex'
import find from 'lodash/find'
import usecases from '@/assets/config_files/usecases.json'

export default {
  data () {
    return {
      usecases: usecases[0],
      // root like circuitbuiling, smallcircuitinsilicoexperiments
      root: ''
    }
  },
  mixins: [collabAuthentication, createCollab],
  mounted () {
    let f = this.$route.fullPath.split('/')
    if (f && f.length > 1) {
      this.root = f[1]
    }
  },
  methods: {
    createItemInExistingCollabDeepModel (collab, uc, model) {
      let ucInfo = this.getUsecaseInfo(uc, model)
      return this.createItemInExistingCollab(collab, uc, ucInfo)
    },
    uglyfy (name) {
      return name.split(' ').map(function (word) {
        return word.toLowerCase()
      }).join('')
    },
    getModelName (modelName) {
      if (modelName) {
        let modelInfo = find(this.usecases[this.root], (elem) => {
          return this.uglyfy(elem.title) === this.uc_name
        })
        return modelInfo.title
      }
    },
    getUsecaseInfo (uc, model) {
      function compact (name) {
        return name.toLowerCase().replace(/ /g, '')
      }
      let categoryInfo = find(this.usecases[this.root], (category) => {
        return compact(category.title) === uc
      })
      let index = findIndex(categoryInfo.models, function (m) {
        return compact(m.title) === model
      })
      return categoryInfo.models[index]
    }
  }
}
