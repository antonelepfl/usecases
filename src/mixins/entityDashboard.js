
import createCollab from 'mixins/createCollab.js'

export default {
  mixins: [createCollab],
  methods: {
    async createItemInExistingCollabWithReplace (collab, item, findString, replaceString) { // creates weeks -> files. Modified.
      // returns the info to generate entry
      var that = this
      try {
        if (item === undefined) {
          return Promise.reject('No item in typesCollabsApps.json')
        } else {
          var exists = {}
          var promises = []
          debugger
          let parentNav = await that.getAllNav(collab.id)
          debugger
          exists = that.checkExists(parentNav, item.appid, item.entryname)
          if (!exists.found) {
            promises.push(that.generateAndFillFilesWithReplace(collab.id, item, that.parentNav, findString, replaceString))
          } else {
            if (that.navitemId === null && item.initial) {
              that.navitemId = exists.navitemId
            }
            promises.push(Promise.resolve(exists))
          }
          if (promises.length === 0) {
            exists['collabId'] = collab.id
            return exists
          } else {
            return await Promise.all(promises)
          }
        }
      } catch (e) { return Promise.reject(e) }
    },

    async generateAndFillFilesWithReplace (collabId, appInfo, parentNav, findString, replaceString) { // modified version.
      // it returns objects that has to be created in the navitem
      var that = this
      debugger
      let newFileId = null
      try {
        let file = await that.createFile(
          appInfo.entryname,
          appInfo.contenttype,
          appInfo.extension,
          that.parent,
          collabId
        )
        var originalFileId = that.getFileByEnv(appInfo)
        if (!originalFileId) {
          return Promise.reject('No entry in typesCollabsApps.json')
        }
        if (!file.exists) {
          let content = await that.getDataRepo(originalFileId)
          content = content.replace(findString, replaceString)
          await that.setFileContent(file.uuid, JSON.stringify(content))
        }
        newFileId = file.uuid
        if (!appInfo.justcopy) {
          that.collabCreationProgress = that.collabCreationProgress + 5
          if (appInfo.initial) {
            that.initialEntryName = appInfo.entryname
          }
          return {
            'entryname': appInfo.entryname,
            'collabId': collabId,
            'parentId': parentNav.id,
            'appId': appInfo.appid,
            'newFileId': newFileId
          }
        } else {
          return {'collabId': collabId, 'entryname': appInfo.entryname}
        }
      } catch (e) { return Promise.reject(e) }
    }
  }
}
