
// let findKey = require('lodash/findKey')
let findIndex = require('lodash/findIndex')
let find = require('lodash/find')
let usecases = require('assets/config_files/usecases.json')[0]

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

export default {
  getUsecaseInfo
}
