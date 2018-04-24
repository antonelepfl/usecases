import modelsBSP from '@/assets/config_files/singlecellmodeling_structure.json'
import modelsNMC from '@/assets/config_files/nmcportalmodels_structure.json'
import usecases from '@/assets/config_files/usecases.json'
import { getUsecaseInfo } from './utils.js'

function getBSPMetadata () {
  let baseUrl = usecases[2].models.bsp.raw
  let models = []
  for (let i = 0; i < modelsBSP.length; i++) {
    let elem = modelsBSP[i]
    let fileName = Object.keys(elem)[0]
    let modelInfo = elem[fileName].meta
    let morphPath = baseUrl + fileName + '/' + elem[fileName].morph
    modelInfo.morphImg = morphPath
    let responsePath = baseUrl + fileName + '/' + elem[fileName].responses
    modelInfo.reponsesImg = responsePath
    modelInfo.folderName = fileName
    modelInfo.modelTitle = getModelTitle(modelInfo)
    models.push(modelInfo)
  }
  return models
}

function getNMCMetadata () {
  let baseUrl = usecases[2].models.nmcportal.raw
  let models = []
  for (let i = 0; i < modelsNMC.length; i++) {
    let elem = modelsNMC[i]
    let fileName = Object.keys(elem)[0]
    let modelInfo = elem[fileName].meta
    let morphPath = baseUrl + elem[fileName].morph
    modelInfo.morphImg = morphPath
    let responsePath = baseUrl + elem[fileName].responses
    modelInfo.reponsesImg = responsePath
    modelInfo.folderName = fileName
    modelInfo.modelTitle = getModelTitle(modelInfo)
    models.push(modelInfo)
  }
  return models
}

function search (text, originalModels) {
  return new Promise(function (resolve) {
    let idleAPI = window.requestIdleCallback
    if (idleAPI) {
      idleAPI(function () {
        resolve(searchPerformance(text, originalModels))
      })
    } else {
      resolve(searchPerformance(text, originalModels))
    }
  })
}

function searchPerformance (text, originalModels) {
  let attributes = text.split(' ')
  let attributesSize = attributes.length
  let matches = originalModels
  for (let i = 0; i < attributesSize; i++) {
    text = attributes[i].toLowerCase().replace(/\s+/g, '')
    let matchesTemp = matches.filter(function (v) {
      let title = v.modelTitle.toLowerCase().replace(/\s+/g, '')
      return (title.search(text) !== -1)
    })
    matches = matchesTemp
  }
  return matches
}

function getModelTitle (modelInfo) {
  let title = modelInfo.species + ' ' + modelInfo.brain_structure + ' '
  title += modelInfo.cell_soma_location + ' ' + modelInfo.cell_type + ' '
  title += modelInfo['e-type'] + ' ' + modelInfo.morphology
  return title
}

function getModelByUc (ucName) {
  let ucInfo = getUsecaseInfo(ucName)
  return ucInfo.models
}

export default {
  getBSPMetadata,
  getNMCMetadata,
  searchPerformance,
  search,
  getModelTitle,
  getModelByUc
}
