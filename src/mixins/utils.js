
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import swal from 'sweetalert2';
import usecasesFile from '@/assets/config_files/usecases.json';

const usecases = usecasesFile[0];

function compact(name) {
  return name.toLowerCase().replace(/ /g, '');
}

function getUsecaseInfo(ucName) {
  let elem = {};
  find(usecases, (category) => {
    const index = findIndex(category, uc => compact(uc.title) === ucName);
    elem = category[index];
    return elem;
  });
  // return the elem otherwise it will return the category
  return elem;
}

function replaceConfirmation() {
  return swal({
    title: 'Replace File(s)?',
    text: 'File(s) already exists in this Collab',
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Go to Collab',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Replace',
  }).then(result => result.value);
}

function getDateDashed() {
  const d = new Date();
  return `${d.toLocaleDateString().replace(/\//g, '-')} ${d.toLocaleTimeString()}`;
}

function getContributorFormated(model) {
  const contributorsList = [];
  if ((typeof model.contributors === 'string')) {
    const fullContributor = [];
    fullContributor.push(model.contributors || '');
    if (model.email) {
      fullContributor.push(` - ${model.email}`);
    }
    contributorsList.push(fullContributor.join(' '));
  } else if (Array.isArray(model.contributors)) {
    model.contributors.forEach((contributor, index) => {
      const fullContributor = [];
      fullContributor.push(contributor.name || '');
      if (contributor.email) {
        fullContributor.push(` - ${contributor.email}`);
      }
      if (index < model.contributors.length - 1) { // has next
        fullContributor.push('| ');
      }
      contributorsList.push(fullContributor.join(' '));
    });
  }
  return contributorsList;
}

export {
  getUsecaseInfo,
  getContributorFormated,
  compact,
  replaceConfirmation,
  getDateDashed,
};
