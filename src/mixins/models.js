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
      text = text.toLowerCase().replace(/\s+/g, '')
      let matches = originalModels.filter(function (v) {
        let title = v.modelTitle.toLowerCase().replace(/\s+/g, '')
        return title.search(text) !== -1
      });
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
