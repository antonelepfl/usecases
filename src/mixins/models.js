import modelsGranule from '@/assets/config_files/granule_models.json'
import modelsHippocampus from '@/assets/config_files/hippocampus_models.json'
import modelsPurkinje from '@/assets/config_files/purkinje_models.json'
import modelsNMC from '@/assets/config_files/nmcportalmodels_structure.json'
import usecases from '@/assets/config_files/usecases.json'
import { getUsecaseInfo } from './utils.js'

function getGranuleMetadata () {
  const modelsZipBase = usecases[2].models.cerebellum.raw
  return populateGenericModels(modelsZipBase, modelsGranule)
}

function getPurkinjeMetadata () {
  const modelsZipBase = usecases[2].models.purkinje.raw
  return populateGenericModels(modelsZipBase, modelsPurkinje)
}

function getHippocampusMetadata () {
  const modelsZipBase = usecases[2].models.hippocampus.raw
  return populateGenericModels(modelsZipBase, modelsHippocampus)
}

function populateGenericModels(modelsZipBase, models) {
  let modelsPopulated = []
  models.forEach((elem) => {
    let fileName = Object.keys(elem)[0]
    let modelInfo = elem[fileName].meta
    modelInfo.morphImg = elem[fileName].morph
    modelInfo.reponsesImg = elem[fileName].responses
    modelInfo.folderName = fileName
    modelInfo.modelTitle = getModelTitle(modelInfo)
    modelInfo.modelZipBase = modelsZipBase
    modelsPopulated.push(modelInfo)
  })
  return modelsPopulated
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
    modelInfo.author = modelInfo.contributors
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
  const species = modelInfo.species.split(' ')[0];
  const region = modelInfo.brain_region || modelInfo.brain_structure;
  const type = modelInfo.cell_type.replace(/ /g, '_');
  const name = (modelInfo.name || modelInfo.folderName).replace(/ /g, '_');
  const title = `${species} ${region} ${type} ${name}`
  return title
}

function getModelByUc (ucName) {
  let ucInfo = getUsecaseInfo(ucName)
  return ucInfo.models
}

export default {
  getHippocampusMetadata,
  getGranuleMetadata,
  getPurkinjeMetadata,
  getNMCMetadata,
  searchPerformance,
  search,
  getModelTitle,
  getModelByUc
}
