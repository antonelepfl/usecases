export default {
  methods: {
    getBSPMetadata (folderContent, path) {
      let models = []
      for (let i = 0; i < folderContent.length; i++) {
        let elem = folderContent[i]
        let fileName = Object.keys(elem)[0]
        let modelInfo = elem[fileName].meta
        let morphPath = path + fileName + '/' + elem[fileName].morph
        modelInfo.morphImg = morphPath
        let responsePath = path + fileName + '/' + elem[fileName].responses
        modelInfo.reponsesImg = responsePath
        modelInfo.folderName = fileName
        modelInfo.modelTitle = this.getModelTitle(modelInfo)
        models.push(modelInfo)
      }
      return models
    },
    search (text, originalModels) {
      let that = this
      return new Promise(function (resolve, reject) {
        let idleAPI = window.requestIdleCallback
        if (idleAPI) {
          idleAPI(function () {
            resolve(that.searchPerformance(text, originalModels))
          })
        } else {
          resolve(that.searchPerformance(text, originalModels))
        }
      })
    },
    searchPerformance (text, originalModels) {
      let attributes = text.split(' ')
      let attributesSize = attributes.length
      let matches = originalModels
      for (let i = 0; i < attributesSize; i++) {
        text = attributes[i].toLowerCase().replace(/\s+/g, '')
        let matchesTemp = matches.filter(function (v) {
          let title = v.modelTitle.toLowerCase().replace(/\s+/g, '')
          return title.search(text) !== -1
        })
        matches = matchesTemp
      }
      return matches
    },
    getModelTitle (modelInfo) {
      let title = modelInfo.species + ' ' + modelInfo.brain_structure + ' '
      title += modelInfo.cell_soma_location + ' ' + modelInfo.cell_type + ' '
      title += modelInfo['e-type'] + ' ' + modelInfo.morphology
      return title
    }
  }
}
