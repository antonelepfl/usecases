import createCollab from 'mixins/createCollab.js'
import collabAuthentication from 'mixins/collabAuthentication.js'
import usecases from 'assets/config_files/usecases.json'
import uuid from 'uuid4'
import axios from 'axios'
const COLLAB_API = 'https://services.humanbrainproject.eu/collab/v0/'

export default {
  mixins: [collabAuthentication, createCollab],
  data: function () {
    return {
      navitemId: null,
      moocUc: null,
      initialEntryName: null,
      parent: null,
      parentNav: null,
      moocWeek: null,
      usecaseMooc: usecases[0].mooc,
      moocFullWeeks: null
    }
  },
  methods: {
    async createMoocCollab (isPrivate, fullCollabName) {
      var that = this
      try {
        await that.getUserInfo()
        that.collabCreationProgress = 10
        let collab = await that.createCollab(fullCollabName, isPrivate)
        that.addCollabMemeber(collab.id, '303700')
        return collab
      } catch (e) { return Promise.reject(e) }
    },
    addMoocExistingCollab (collab, uc, week) {
      try {
        return this.createCoursesMooc(collab, uc, week)
      } catch (e) { return Promise.reject(e) }
    },
    addSetUserCell (content) {
      let parsed = content
      let userid = null

      if (typeof (content) === 'string') {
        parsed = JSON.parse(content)
      }
      let queryParam = window.location.href.match(/state=([^&]+)/)
      if (queryParam) {
        userid = queryParam[1]
        parsed.metadata['userid'] = userid
      }

      return JSON.stringify(parsed)
    },
    async createCoursesMooc (collab, uc, week) { // cretes mooc -> weeks
      var that = this
      this.moocWeek = await this.getWeekInfo(uc, week)
      let coursesPromises = []
      try {
        await that.getNavElement(collab.id)
        if (that.moocWeek && that.moocWeek.files) {
          this.moocWeek.files.forEach((file) => {
            let creat = that.createItemInExistingCollab(collab, file)
            coursesPromises.push(creat)
          })
          let elements = await Promise.all(coursesPromises)
          let emptyNavItemsId = await that.generateNavItems(elements)
          let prom = []
          for (let item in emptyNavItemsId) {
            prom.push(that.copyContentToNav(emptyNavItemsId[item]))
          }
          await Promise.all(prom)// populate navitem parallel
          that.collabCreationProgress = that.collabCreationProgress + 5

          that.redirectToCollab(collab.id, that.navitemId)
          await setTimeout(1500) // if it does not redirect stop loading
          return
        }
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async createItemInExistingCollab (collab, item) { // creates weeks -> files. Modified.
      // returns the info to generate entry
      var that = this
      try {
        if (item === undefined) {
          return Promise.reject('No item in typesCollabsApps.json')
        } else {
          var exists = {};
          var promises = []
            exists = that.checkExists(that.parentNav, item.appid, item.entryname)
            if (!exists.found) {
              promises.push(that.generateAndFillFiles(collab.id, item, that.parentNav))
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
    async generateAndFillFiles (collabId, appInfo, parentNav) { // modified version.
      // it returns objects that has to be created in the navitem
      var that = this
      let newFileId = null
      try {
        let file = await that.createFile(
          appInfo.entryname,
          appInfo.contenttype,
          appInfo.extension,
          that.parent,
          collabId
        )
        var originalFileId = appInfo.file
        if (!originalFileId) {
          return Promise.reject('No entry in typesCollabsApps.json')
        }
        if (!file.exists) {
          let content = await that.getDataRepo(originalFileId)
          let newContent = that.addSetUserCell(content)
          await that.setFileContent(file.uuid, JSON.stringify(newContent))
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
    },
    async searchCollab (param) {
      var that = this
      try {
        // header from CreateCollab
        let response = await that.$http.get(COLLAB_API + 'mycollabs/?search=' + param, that.header)
        return response.data.results
      } catch (responseError) {
        if (responseError.status === 401) {
          that.getToken(true) // force renew token
          return Promise.reject(responseError)
        } else {
          return Promise.reject(responseError)
        }
      }
    },
    async updateFullCollabName (searchText, moocName, week) {
      try {
        let user = await this.getUserInfo()
        let d = new Date().toLocaleString()
        if (searchText === '') {
          searchText = 'Mooc'
        }
        this.fullCollabName = searchText + ' - ' + moocName + ' - Week ' + week + ' - ' + user.displayName + ' ' + d
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
        for (let i = 0; i < that.moocWeek.files.length; i++) {
          let element = that.moocWeek.files[i]
          if (!element.justcopy) {
            let item = that.findEntryInStructure(unsortedCourses, element.entryname)
            let elem = null
            if (item && !item.found) {
              elem = await that.createNavEntry(item.entryname, item.collabId, item.parentId, item.appId, item.newFileId)
            } else {
              console.debug(element.entryname + ' already exists')
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
          'navitemId': navItem.data.id,
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
    },
    async getMoocFullConfig (ucCompactName) {
      // ucCompactName: is the name of the mooc without spaces
      if (ucCompactName) {
        let found = this.usecaseMooc.find((elem) => {
          return this.compact(elem.title) === ucCompactName
        })
        if (found) {
          let configUrl = found.config_url
          let moocConfig = await axios.get(configUrl)
          this.moocFullWeeks = moocConfig.data
          return moocConfig.data
        }
      } else {
        console.error('No mooc name was passed as argument')
      }
      return null
    },
    async getWeekInfo (ucCompactName, weekCompactName) {
      // ucCompactName: is the name of the mooc without spaces
      // weekCompactName: is the name of the week without spaces
      if (!this.moocFullWeeks) {
        this.moocFullWeeks = await this.getMoocFullConfig(ucCompactName)
      }
      this.moocWeek = this.moocFullWeeks.find((elem) => {
        return this.compact(elem.title) === weekCompactName
      })
      return this.moocWeek
    },
    compact (name) {
      return name.toLowerCase().replace(/ /g, '')
    }
  }
}
