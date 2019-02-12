import modelsGranule from '@/assets/config_files/granule_models.json';
import modelsHippocampus from '@/assets/config_files/hippocampus_models.json';
import modelsPurkinje from '@/assets/config_files/purkinje_models.json';
import modelsNMC from '@/assets/config_files/nmcportalmodels_structure.json';
import usecases from '@/assets/config_files/usecases.json';
import { getUsecaseInfo } from './utils';

function getModelTitle(modelInfo) {
  const species = modelInfo.species.split(' ')[0];
  const region = modelInfo.brain_region || modelInfo.brain_structure;
  const type = modelInfo.cell_type.replace(/ /g, '_');
  const name = (modelInfo.name || modelInfo.folderName).replace(/ /g, '_');
  const title = `${species} ${region} ${type} ${name}`;
  return title;
}

function populateGenericModels(modelsZipBase, models) {
  const modelsPopulated = [];
  models.forEach((elem) => {
    const fileName = Object.keys(elem)[0];
    const modelInfo = elem[fileName].meta;
    modelInfo.morphImg = elem[fileName].morph;
    modelInfo.reponsesImg = elem[fileName].responses;
    modelInfo.folderName = fileName;
    modelInfo.modelTitle = getModelTitle(modelInfo);
    modelInfo.modelZipBase = modelsZipBase;
    modelsPopulated.push(modelInfo);
  });
  return modelsPopulated;
}

function getGranuleMetadata() {
  const modelsZipBase = usecases[2].models.cerebellum.raw;
  return populateGenericModels(modelsZipBase, modelsGranule);
}

function getPurkinjeMetadata() {
  const modelsZipBase = usecases[2].models.purkinje.raw;
  return populateGenericModels(modelsZipBase, modelsPurkinje);
}

function getHippocampusMetadata() {
  const modelsZipBase = usecases[2].models.hippocampus.raw;
  return populateGenericModels(modelsZipBase, modelsHippocampus);
}

function getNMCMetadata() {
  const baseUrl = usecases[2].models.nmcportal.raw;
  const models = [];
  for (let i = 0; i < modelsNMC.length; i += 1) {
    const elem = modelsNMC[i];
    const fileName = Object.keys(elem)[0];
    const modelInfo = elem[fileName].meta;
    const morphPath = baseUrl + elem[fileName].morph;
    modelInfo.morphImg = morphPath;
    const responsePath = baseUrl + elem[fileName].responses;
    modelInfo.reponsesImg = responsePath;
    modelInfo.folderName = fileName;
    modelInfo.author = modelInfo.contributors;
    modelInfo.modelTitle = getModelTitle(modelInfo);
    models.push(modelInfo);
  }
  return models;
}

function searchPerformance(text, originalModels) {
  const attributes = text.split(' ');
  const attributesSize = attributes.length;
  let matches = originalModels;

  const filterTerm = textTerm => (
    matches.filter((v) => {
      const title = v.modelTitle.toLowerCase().replace(/\s+/g, '');
      return (title.search(textTerm) !== -1);
    })
  );

  for (let i = 0; i < attributesSize; i += 1) {
    const textTerm = attributes[i].toLowerCase().replace(/\s+/g, '');
    matches = filterTerm(textTerm);
  }
  return matches;
}

function search(text, originalModels) {
  return new Promise(((resolve) => {
    const idleAPI = window.requestIdleCallback;
    if (idleAPI) {
      idleAPI(() => {
        resolve(searchPerformance(text, originalModels));
      });
    } else {
      resolve(searchPerformance(text, originalModels));
    }
  }));
}

function getModelByUc(ucName) {
  const ucInfo = getUsecaseInfo(ucName);
  return ucInfo.models;
}

export default {
  getHippocampusMetadata,
  getGranuleMetadata,
  getPurkinjeMetadata,
  getNMCMetadata,
  searchPerformance,
  search,
  getModelTitle,
  getModelByUc,
};
