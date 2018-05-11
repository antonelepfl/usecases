
// let findKey = require('lodash/findKey')
let findIndex = require('lodash/findIndex')
let find = require('lodash/find')
let usecases = require('@/assets/config_files/usecases.json')[0]
let swal = require('sweetalert2')

function getUsecaseInfo (ucName) {
  let elem = {}
  find(usecases, function (category) {
    let index = findIndex(category, function (uc) {
      return compact(uc.title) === ucName
    })
    elem = category[index]
    return elem
  })
  // return the elem otherwise it will return the category
  return elem
}

function compact (name) {
  return name.toLowerCase().replace(/ /g, '')
}

function replaceConfirmation () {
  return swal({
    title: 'Replace File(s)?',
    text: 'File(s) already exists in this Collab',
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Go to Collab',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Replace'
  }).then((result) => {
    return result.value
  })
}

function getDateDashed () {
  let d = new Date()
  return d.toLocaleDateString().replace(/\//g, '-') + ' ' + d.toLocaleTimeString()
}

function getContributorFormated (model) {
  let contributorsList = []
  if ((typeof model.contributors === 'string')) {
    let fullContributor = []
    fullContributor.push(model.contributors || '')
    if (model.email) {
      fullContributor.push(' - ' + model.email)
    }
    contributorsList.push(fullContributor.join(' '))
    return contributorsList
  }
  if (Array.isArray(model.contributors)) {
    model.contributors.forEach((contributor, index) => {
      let fullContributor = []
      fullContributor.push(contributor.name || '')
      if (contributor.email) {
        fullContributor.push(' - ' + contributor.email)
      }
      if (index < model.contributors.length - 1) { // has next
        fullContributor.push('| ')
      }
      contributorsList.push(fullContributor.join(' '))
    })
    return contributorsList
  }
}

export {
  getUsecaseInfo,
  getContributorFormated,
  compact,
  replaceConfirmation,
  getDateDashed
}
