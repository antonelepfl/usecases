import createCollab from 'mixins/createCollab.js'
import collabAuthentication from 'mixins/collabAuthentication.js'
import typesCollabsApps from 'assets/config_files/types_collabs_apps.json'
import uuid from 'uuid4'
const COLLAB_API = 'https://services.humanbrainproject.eu/collab/v0/'
export default {
  mixins: [collabAuthentication, createCollab],
  data: function () {
    return {
      navitemId: null,
      moocUc: null,
      initialEntryName: null,
      parent: null,
      parentNav: null
    }
  },
  methods: {
    async createMoocCollab (isPrivate, fullCollabName) {
      var that = this
      try {
        await that.getUserInfo()
        that.collabCreationProgress = 20
        let collab = await that.createCollab(fullCollabName, isPrivate)
        return collab
      } catch (e) { return Promise.reject(e) }
    },
    addMoocExistingCollab (collab, uc) {
      try {
        return this.createCoursesMooc(collab, uc)
      } catch (e) { return Promise.reject(e) }
    },
    async createCoursesMooc (collab, uc) { // cretes mooc -> weeks
      var that = this
      that.moocUc = typesCollabsApps[uc]
      let coursesPromises = []
      try {
        await that.getNavElement(collab.id)
        if (that.moocUc && that.moocUc.children) {
          for (let i = 0; i < that.moocUc.children.length; i++) {
            let creat = that.createItemInExistingCollab(collab, that.moocUc.children[i])
            coursesPromises.push(creat)
          }
          let elements = await Promise.all(coursesPromises)
          let emptyNavItemsId = await that.generateNavItems(elements)
          let prom = []
          for (let item in emptyNavItemsId) {
            prom.push(that.copyContentToNav(emptyNavItemsId[item]))
          }
          await Promise.all(prom)// populate navitem parallel
          that.collabCreationProgress = that.collabCreationProgress + 20

          that.redirectToCollab(collab.id, that.navitemId)
          await setTimeout(1500) // if it does not redirect stop loading
          return
        }
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async createItemInExistingCollab (collab, uc) { // creates weeks -> files. Modified.
      // returns the info to generate entry
      var ucInfo = uc
      var that = this
      try {
        if (ucInfo === undefined) {
          return Promise.reject('No item in typesCollabsApps.json')
        } else {
          var exists = {};
          var promises = []
          for (let i = 0; i < ucInfo.length; i++) {
            var item = ucInfo[i]
            exists = that.checkExists(that.parentNav, item.appid, item.entryname)
            if (!exists.found) {
              promises.push(that.generateAndFillFiles(collab.id, item, that.parentNav))
            } else {
              if (that.navitemId === null && item.initial) {
                that.navitemId = exists.navitemId
              }
              promises.push(Promise.resolve(exists))
            }
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
    async generateAndFillFiles (collabId, appInfo, parentNav) { // modified version.
      // it returns objects that has to be created in the navitem
      var that = this
      let newFileId = null
      try {
        let file = await that.createFile(appInfo.entryname, appInfo.contenttype, appInfo.extension, that.parent, collabId)
        try {
          var originalFileId = appInfo.file
          if (!originalFileId) {
            return Promise.reject('No entry in typesCollabsApps.json')
          }
          if (file.exists) {
            newFileId = file.uuid
          } else {
            newFileId = await that.copyFileContent(originalFileId, file.uuid)
          }
        } catch (error) {
          console.error(error)
          return {'collabId': collabId}
        }
        if (!appInfo.justcopy) {
          that.collabCreationProgress = that.collabCreationProgress + 15
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
    },
    async searchCollab (param, moocName) {
      var that = this
      let user = await that.getUserInfo()
      param = param + ' ' + moocName + ' ' + user.displayName
      try {
        let response = await that.$http.get(COLLAB_API + 'mycollabs/?search=' + param, that.header) // header from CreateCollab
        return response.body.results
      } catch (responseError) {
        if (responseError.status === 401) {
          that.getToken(true) // force renew token
          return Promise.reject(responseError)
        } else {
          return Promise.reject(responseError)
        }
      }
    },
    async updateFullCollabName (searchText, moocName) {
      try {
        let user = await this.getUserInfo()
        let d = new Date().toLocaleString()
        if (searchText === '') {
          searchText = 'Mooc'
        }
        this.fullCollabName = searchText + ' - ' + moocName + ' - ' + user.displayName + ' ' + d
      } catch (e) { return Promise.reject(e) }
    },
    findInitialEntry (entry, queryName) {
      return entry.entryName === queryName
    },
    findNotebook (entry) {
      return entry.justcopy === false
    },
    findEntryInStructure (unsortedCourses, entryName) {
      // will find an element in the courses -> children structure
      for (let i = 0; i < unsortedCourses.length; i++) {
        let unsortedItems = unsortedCourses[i]
        for (let j = 0; j < unsortedItems.length; j++) {
          let item = unsortedItems[j]
          if (item.entryname === entryName) {
            return item;
          }
        }
      }
    },
    setInitialNavItem (elem) { // add into the global variable the initial item to be redirected
      if (this.navitemId == null && this.initialEntryName === elem.entryName) {
        this.navitemId = elem.navitemId
      }
    },
    async generateNavItems (unsortedCourses) {
      let that = this
       // TOOD convert this in parallel when collab order works
      let navItemsIdOrdered = []
      try {
        for (let i = 0; i < that.moocUc.children.length; i++) {
          let notebook = that.moocUc.children[i].find(that.findNotebook)
          if (notebook) {
            let item = that.findEntryInStructure(unsortedCourses, notebook.entryname)
            let elem = null
            // let p = null
            if (item && !item.found) {
              elem = await that.createNavEntry(item.entryname, item.collabId, item.parentId, item.appId, item.newFileId)
            } else {
              console.debug(notebook.entryname + ' already exists')
            }
            that.setInitialNavItem(elem)
            if (elem) { navItemsIdOrdered.push(elem) }
          }
        }
        return navItemsIdOrdered
      } catch (e) { return Promise.reject(e) }
    },
    async getNavElement (collabId) {
      try {
        let elems = await Promise.all([
          this.getCollabStorage(collabId),
          this.getAllNav(collabId)
        ])
        this.parent = elems[0].results[0].uuid
        this.parentNav = elems[1]
        return
      } catch (e) { return Promise.reject(e) }
    },
    async createNavEntry (entryName, collabId, parentId, appId, fileId, order) {
      var that = this
      try {
        var context = uuid()
        var navOrder = order || -1
        var type = 'IT'
        var payload = {
          'app_id': appId,
          'context': context,
          'name': entryName,
          'order_index': navOrder,
          'parent': parentId,
          'type': type
        }
        var collabReq = COLLAB_API + 'collab/' + collabId + '/nav/'
        let navItem = await that.$http.post(collabReq, payload, that.header) // create navitem
        let navInfo = { // info to populate the navitem
          'fileId': fileId,
          'navitemId': navItem.body.id,
          'collabId': collabId,
          'context': context,
          'entryName': entryName
        }
        return navInfo
      } catch (e) { return Promise.reject('Error to create NavItem') }
    },
    async copyContentToNav (navInfo) {
      let that = this
      try {
        await that.fillJupyterNavItem(navInfo.fileId, navInfo.navitemId, navInfo.collabId, navInfo.context)
        console.debug('Nav entry created')
        return {'collabId': navInfo.collabId, 'navitemId': navInfo.navitemId, 'entryName': navInfo.entryName}
      } catch (e) { return Promise.reject('Error in fillJupyterNavItem') }
    }
  }
}
