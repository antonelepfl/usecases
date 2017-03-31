import typesCollabsApps from 'assets/config_files/types_collabs_apps.json'
import createCollab from 'mixins/createCollab.js'
import collabAuthentication from 'mixins/collabAuthentication.js'
const BSP_PUBLIC_REPO = 'https://github.com/lbologna/bsp_data_repository/raw/master/optimizations/'

export default {
  data () {
    return {
      typesCollabsApps: typesCollabsApps,
      header: {}
    }
  },
  mixins: [collabAuthentication, createCollab],
  created () {
    let that = this
    this.getToken().then(function (token) {
      that.header = {headers: {'Authorization': token}}
    }) // from collabAuthentication
  },
  methods: {
    createItemInExistingCollabWithReplace (collab, uc, morphology, findString) {
      var replaceString = BSP_PUBLIC_REPO + morphology + '/' + morphology + '.zip'
      var that = this
      return new Promise(function (resolve, reject) {
        that.getAllNav(collab.id).then(function (parentNav) {
          var ucInfo = that.typesCollabsApps[uc]
          var exists = {};
          ucInfo.entryname = ucInfo.entryname + ' - ' + morphology
          if (ucInfo.appid) { // is only one item
            exists = that.checkExists(parentNav, ucInfo.appid, ucInfo.entryname)
          }
          if (!exists.found) {
            var promises = []
            if (ucInfo.children) {
              for (let i = 0; i < ucInfo.children.length; i++) {
                var item = ucInfo.children[i]
                ucInfo.entryname = item.entryname + ' - ' + morphology
                exists = that.checkExists(parentNav, item.appid, ucInfo.entryname)
                if (!exists.found) {
                  if (item.appid === that.typesCollabsApps.jupyternotebook.appid) { // if is jupyter notebook
                    promises.push(that.replaceContentAndCopy(findString, replaceString, collab.id, item, parentNav))
                  } else { // is not jupyter notebok just connect to the original file
                    promises.push(that.createNavEntry(ucInfo.entryname, collab.id, parentNav.id, item.appid))
                  }
                }
              }
            } else { // is only one navitem
              if (ucInfo.appid === that.typesCollabsApps.jupyternotebook.appid) { // if is jupyter notebook
                promises.push(that.replaceContentAndCopy(findString, replaceString, collab.id, ucInfo, parentNav))
              } else { // is not jupyter notebok just connect to the original file
                promises.push(that.createNavEntry(ucInfo.entryname, collab.id, parentNav.id, ucInfo.appid))
              }
            }
            Promise.all(promises).then(function (generatedNotebooks) {
              let obj = generatedNotebooks[0]
              if (obj.collabId) {
                that.redirectToCollab(obj.collabId, obj.navitemId)
                resolve()
              }
            }, function (e) {
              console.error('Error creating multiple files in existing collab')
              reject(e)
            })
          } else { // found
            console.debug('Existing app in collab found')
            that.redirectToCollab(collab.id, exists.navitemId)
            resolve()
          }
        }, function (error) {
          console.error(error)
          reject(error)
        })
      })
    }
  }
}
