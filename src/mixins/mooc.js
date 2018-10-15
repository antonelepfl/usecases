
/* eslint-disable no-console */
import createCollab from '@/mixins/createCollab.js'
import collabAuthentication from '@/mixins/collabAuthentication.js'
import usecases from '@/assets/config_files/usecases.json'
import uuid from 'uuid4'
import axios from 'axios'
import store from '@/mixins/store.js'
const COLLAB_API = 'https://services.humanbrainproject.eu/collab/v0/'

export default {
  mixins: [collabAuthentication, createCollab],
  data: function () {
    return {
      navitemId: null,
      moocUc: null,
      initialEntryName: null,
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
    async createCoursesMooc (collab, uc, week) { // cretes mooc -> weeks
      var that = this
      this.moocWeek = await this.getWeekInfo(uc, week)
      let coursesPromises = []
      try {
        console.debug('before getNavElement')
        await that.getNavElement(collab.id)
        if (that.moocWeek && that.moocWeek.files) {
          let isReplace = await that.replaceExistsDialog(store.state.allNavItems, that.moocWeek.files)
          this.moocWeek.files.forEach((file) => {
            if (!isReplace) { // no replace. generate new navitem and new file
              throw String('abort and redirect')
            }
            let creat = that.createItemInExistingCollab(collab, file)
            coursesPromises.push(creat)
          })
          let elements = await Promise.all(coursesPromises)
          let emptyNavItemsId = await that.generateNavItems(that.moocWeek.files, elements)
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
        that.abortAndRedirect(collab, that.moocWeek, e)
      }
    },
    async createItemInExistingCollab (collab, item, replaceObj) { // creates weeks -> files. Modified.
      // returns the info to generate entry
      var that = this
      try {
        if (item === undefined) {
          return Promise.reject('No item')
        } else {
          if (!store.navItemsExist()) { await that.getNavElement(collab.id) }
          return that.generateAndFillFiles(collab.id, item, store.state.allNavItems, replaceObj)
        }
      } catch (e) { return Promise.reject(e) }
    },
    async generateAndFillFiles (collabId, appInfo, parentNav, replaceObj) { // modified version.
      // it returns objects that has to be created in the navitem
      var that = this
      let newFileId = null
      try {
        let file = await that.createFile(
          appInfo.entryname,
          appInfo.contenttype,
          appInfo.extension,
          store.state.collabInfo.uuid,
          collabId
        )
        var originalFileId = that.getFileByEnv(appInfo)
        if (!originalFileId) {
          return Promise.reject('No entry in typesCollabsApps.json')
        }

        if (!file.exists || (file.exists && store.state.rewriteFiles)) {
          console.debug('Put content to file')
          let content = await that.getDataRepo(originalFileId)
          if (appInfo.contenttype === 'x-ipynb+json') {
            content = this.addSubmissionTokenMetadata(content);
          }
          if (replaceObj) {
            console.debug(`Replacing ${replaceObj.replaceText}`)
            if (typeof content !== 'string') { content = JSON.stringify(content) }
            content = content.replace(replaceObj.findString, replaceObj.replaceText)
          }
          if (typeof content !== 'string') { content = JSON.stringify(content) }
          await that.setFileContent(file.uuid, content)
        }
        newFileId = file.uuid
        if (!appInfo.justcopy) {
          that.collabCreationProgress = that.collabCreationProgress + 5
          if (appInfo.initial) {
            that.initialEntryName = appInfo.entryname
            console.debug('Initial NavItem', appInfo.entryname)
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
      } catch (error) {
        if (error.response.status === 401) {
          that.renewToken(true) // force renew token
          return Promise.reject(error)
        } else {
          return Promise.reject(error)
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
    findEntryInStructure (unsortedCourses, entryName) {
      // will find an element in the courses -> children structure
      return unsortedCourses.find((elem) => {
        return elem.entryname === entryName
      })
    },
    setInitialNavItem (elem) { // add into the global variable the initial item to be redirected
      if (this.navitemId == null && this.initialEntryName === elem.entryName) {
        console.debug('Set Initial NavItem:', elem.entryName)
        this.navitemId = elem.navitemId
      }
    },
    addSubmissionTokenMetadata (content) {
      let parsed = content
      let submissiontoken = null

      if (typeof (content) === 'string') {
        parsed = JSON.parse(content)
      }
      let queryParam = window.location.href.match(/state=([^&]+)/)
      if (queryParam) {
        submissiontoken = queryParam[1]
        parsed.metadata['submission_token'] = submissiontoken
      }

      return JSON.stringify(parsed)
    },
    async generateNavItems (files, unsortedCourses) {
      let that = this
       // TOOD convert this in parallel when collab order works
      let navItemsIdOrdered = []
      try {
        console.debug('generateNavItems')
        for (let i = 0; i < files.length; i++) {
          let element = files[i]
          if (!element.justcopy) {
            let item = that.findEntryInStructure(unsortedCourses, element.entryname)
            let elem = null
            if (item) {
              let o = {
                'entryName': item.entryname,
                'collabId': item.collabId,
                'parentId': item.parentId,
                'appId': item.appId,
                'fileId': item.newFileId
              }
              elem = await that.createNavEntry(o)
              that.setInitialNavItem(elem)
              navItemsIdOrdered.push(elem)
            }
          }
        }
        return navItemsIdOrdered
      } catch (e) { return Promise.reject(e) }
    },
    async getNavElement (collabId) {
      try {
        await Promise.all([
          this.getCollabStorage(collabId),
          this.getAllNav(collabId)
        ])
      } catch (e) { return Promise.reject(e) }
    },
    async createNavEntry (properties) {
      let navInfo = { // info to populate the navitem
        'fileId': properties.fileId,
        'collabId': properties.collabId,
        'entryName': properties.entryName
      }
      if (store.state.rewriteFiles) { // replace navitem mode
        let exists = this.checkExists(
          store.state.allNavItems,
          properties.appId,
          properties.entryName
        )
        // navitem already exists and
        if (exists.found) {
          console.debug('Navitem found. Keeping it')
          navInfo.navitemId = exists.navitemId
          navInfo.context = exists.navitemContext
          return navInfo
        }
      }
      console.debug('Create a new navitem')
      var that = this
      try {
        var context = uuid()
        var navOrder = properties.order || -1
        var type = 'IT'
        var payload = {
          'app_id': properties.appId,
          'context': context,
          'name': properties.entryName,
          'order_index': navOrder,
          'parent': properties.parentId,
          'type': type
        }
        var collabReq = COLLAB_API + 'collab/' + properties.collabId + '/nav/'
        let navItem = await that.$http.post(collabReq, payload, that.header) // create navitem
        navInfo.navitemId = navItem.data.id
        navInfo.context = context
        return navInfo
      } catch (e) { return Promise.reject('Error to create NavItem') }
    },
    async copyContentToNav (navInfo) {
      let that = this
      try {
        await that.fillJupyterNavItem(navInfo.fileId, navInfo.navitemId, navInfo.collabId, navInfo.context)
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
