
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
import createCollab from '@/mixins/createCollab';
import usecases from '@/assets/config_files/usecases.json';
import uuid from 'uuid4';
import axios from 'axios';
import store from '@/mixins/store';

const COLLAB_API = 'https://services.humanbrainproject.eu/collab/v0/';
const EXTERNAL_LINK_APP_ID = 92;

export default {
  mixins: [createCollab],
  data() {
    return {
      navitemId: null,
      moocUc: null,
      initialEntryName: null,
      moocWeek: null,
      usecaseMooc: usecases[0].mooc,
      moocFullWeeks: null,
    };
  },
  methods: {
    async createMoocCollab(isPrivate, fullCollabName) {
      await this.getUserInfo();
      this.collabCreationProgress = 10;
      const collab = await this.createCollab(fullCollabName, isPrivate);
      this.addCollabMemeber(collab.id, '303700');
      return collab;
    },
    addMoocExistingCollab(collab, uc, week) {
      return this.createCoursesMooc(collab, uc, week);
    },
    async createCoursesMooc(collab, uc, week) { // cretes mooc -> weeks
      this.moocWeek = await this.getWeekInfo(uc, week);
      return this.createGenericCourses(collab, this.moocWeek);
    },
    async createGenericCourses(collab, courseInfo) {
      if (!courseInfo || !courseInfo.files) {
        throw new Error('No course info or files found');
      }
      await this.getNavElement(collab.id);
      const isReplace = await this.replaceExistsDialog(store.state.allNavItems, courseInfo.files);
      if (!isReplace) { // no replace. generate new navitem and new file
        this.abortAndRedirect(collab, courseInfo);
      }
      const elements = await Promise.all(courseInfo.files.map(file => (
        this.createItemInExistingCollab(collab, file)
      )));
      const emptyNavItemsInfo = await this.generateNavItems(courseInfo.files, elements);
      await Promise.all(emptyNavItemsInfo.map(itemInfo => (
        this.copyContentToNav(itemInfo)
      ))); // populate navitem parallel
      this.collabCreationProgress += 5;
      this.redirectToCollab(collab.id, this.navitemId);
    },
    async createItemInExistingCollab(collab, item, replaceObj) { // creates weeks -> files. Modified.
      // returns the info to generate entry
      if (item === undefined) {
        throw new Error('No item');
      }
      if (!store.navItemsExist()) { await this.getNavElement(collab.id); }

      if (item.appid === EXTERNAL_LINK_APP_ID) {
        return this.generateExternalLinkItem(item, collab.id);
      }
      // setting up jupyter notebook
      const createdItem = await this.generateAndFillFiles(collab.id, item, store.state.allNavItems, replaceObj);
      return createdItem;
    },
    generateExternalLinkItem(appInfo, collabId) {
      // this will return the items to then create the nav items and after that change the /config
      if (appInfo.initial) {
        this.initialEntryName = appInfo.entryname;
        console.debug('Initial NavItem', appInfo.entryname);
      }
      return {
        entryname: appInfo.entryname,
        parentId: store.state.allNavItems.id,
        appId: appInfo.appid,
        collabId,
      };
    },
    async generateAndFillFiles(collabId, appInfo, parentNav, replaceObj) { // modified version.
      // it returns objects that has to be created in the navitem
      let newFileId = null;

      const file = await this.createFile(
        appInfo.entryname,
        appInfo.contenttype,
        appInfo.extension,
        store.state.collabInfo.uuid,
        collabId,
      );
      const originalFileId = this.getFileByEnv(appInfo);
      if (!originalFileId) {
        throw new Error('No entry in typesCollabsApps.json');
      }

      if (!file.exists || (file.exists && store.state.rewriteFiles)) {
        console.debug('Put content to file');
        let { content } = await this.getDataFromRepo(originalFileId);
        if (appInfo.contenttype === 'x-ipynb+json') {
          content = this.addSubmissionTokenMetadata(content);
        }
        if (replaceObj) {
          const decodedReplaceText = decodeURIComponent(replaceObj.replaceText);
          const escapedReplaceText = decodedReplaceText.replace(/"/g, '\\"');
          console.debug(`Replacing ${decodedReplaceText}`);
          if (typeof content !== 'string') { content = JSON.stringify(content); }
          content = content.replace(replaceObj.findString, escapedReplaceText);
        }
        if (typeof content !== 'string') { content = JSON.stringify(content); }
        await this.setFileContent(file.uuid, content);
      }
      newFileId = file.uuid;

      if (appInfo.justcopy) return { collabId, entryname: appInfo.entryname };

      this.collabCreationProgress += 5;
      if (appInfo.initial) {
        this.initialEntryName = appInfo.entryname;
        console.debug('Initial NavItem', appInfo.entryname);
      }
      return {
        entryname: appInfo.entryname,
        collabId,
        parentId: parentNav.id,
        appId: appInfo.appid,
        newFileId,
      };
    },
    async searchCollab(param) {
      const that = this;
      try {
        // header from CreateCollab
        const response = await that.$http.get(`${COLLAB_API}mycollabs/?search=${param}`, that.header);
        return response.data.results;
      } catch (error) {
        if (error.response.status === 401) {
          that.renewToken(true); // force renew token
          throw new Error(error);
        }
        throw new Error(error);
      }
    },
    async updateFullCollabName(searchText, moocName, week) {
      const user = await this.getUserInfo();
      const date = new Date().toLocaleString();
      const typedText = searchText || 'MOOC';
      this.fullCollabName = `${typedText} - ${moocName} - Week ${week} - ${user.displayName} ${date}`;
    },
    findEntryInStructure(unsortedCourses, entryName) {
      // will find an element in the courses -> children structure
      return unsortedCourses.find(elem => elem.entryname === entryName);
    },
    setInitialNavItem(elem) { // add into the global variable the initial item to be redirected
      if (this.navitemId == null && this.initialEntryName === elem.entryName) {
        console.debug('Set Initial NavItem:', elem.entryName);
        this.navitemId = elem.navitemId;
      }
    },
    addSubmissionTokenMetadata(content) {
      let parsed = content;
      let submissiontoken = null;

      if (typeof (content) === 'string') {
        parsed = JSON.parse(content);
      }
      const queryParam = window.location.href.match(/state=([^&]+)/);
      if (queryParam) {
        // eslint-disable-next-line
        submissiontoken = queryParam[1];
        parsed.metadata.submission_token = submissiontoken;
      }

      return JSON.stringify(parsed);
    },
    async generateNavItems(files, unsortedCourses) {
      // TOOD convert this in parallel when collab order works
      const navItemsIdOrdered = [];
      try {
        console.debug('generateNavItems');
        for (let i = 0; i < files.length; i += 1) {
          const element = files[i];
          if (!element.justcopy) {
            const item = this.findEntryInStructure(unsortedCourses, element.entryname);
            /* eslint-disable-next-line no-continue */
            if (!item) continue;
            /* eslint-disable-next-line no-await-in-loop */
            const elem = await this.createNavEntry({
              entryName: item.entryname,
              collabId: item.collabId,
              parentId: item.parentId,
              appId: item.appId,
              fileId: item.newFileId,
              url: element.url, // used for external link
            });
            this.setInitialNavItem(elem);
            navItemsIdOrdered.push(elem);
          }
        }
        return navItemsIdOrdered;
      } catch (e) { throw new Error(e); }
    },
    getNavElement(collabId) {
      return Promise.all([
        this.getCollabStorage(collabId),
        this.getAllNav(collabId),
      ]);
    },
    async createNavEntry(properties) {
      const navInfo = { // info to populate the navitem
        fileId: properties.fileId,
        collabId: properties.collabId,
        entryName: properties.entryName,
        appId: properties.appId,
        url: properties.url, // used for external link
      };
      if (store.state.rewriteFiles) { // replace navitem mode
        const exists = this.checkExists(
          store.state.allNavItems,
          properties.appId,
          properties.entryName,
        );
        // navitem already exists and
        if (exists.found) {
          console.debug('Navitem found. Keeping it');
          navInfo.navitemId = exists.navitemId;
          navInfo.context = exists.navitemContext;
          return navInfo;
        }
      }
      console.debug('Create a new navitem');
      const that = this;
      try {
        const context = uuid();
        const navOrder = properties.order || -1;
        const type = 'IT';
        const payload = {
          app_id: properties.appId,
          name: properties.entryName,
          order_index: navOrder,
          parent: properties.parentId,
          context,
          type,
        };
        const collabReq = `${COLLAB_API}collab/${properties.collabId}/nav/`;
        const navItem = await that.$http.post(collabReq, payload, that.header); // create navitem
        navInfo.navitemId = navItem.data.id;
        navInfo.context = context;
        return navInfo;
      } catch (e) { throw new Error('Error to create NavItem'); }
    },
    copyContentToNav(navInfo) {
      if (navInfo.appId === EXTERNAL_LINK_APP_ID) {
        return this.setLinkToConfig(navInfo.context, navInfo.url, navInfo.collabId)
          .catch((e) => {
            console.error(e);
            throw new Error('Error generating external link');
          });
      }

      return this.fillJupyterNavItem(navInfo.fileId, navInfo.navitemId, navInfo.collabId, navInfo.context)
        .then(() => ({
          collabId: navInfo.collabId, navitemId: navInfo.navitemId, entryName: navInfo.entryName,
        }))
        .catch((e) => {
          console.error(e);
          throw new Error('Error in fillJupyterNavItem');
        });
    },
    setLinkToConfig(context, url, collab) {
      console.debug('Posting config');
      const configUrl = `${COLLAB_API}config/${context}/`;
      const payload = {
        context,
        content: JSON.stringify({ url: `${url}?collab=${collab}`, iframe_support: false }),
      };
      return this.$http.put(configUrl, payload, this.header);
    },
    async getMoocFullConfig(ucCompactName) {
      // ucCompactName: is the name of the mooc without spaces
      if (ucCompactName) {
        const found = this.usecaseMooc.find(elem => this.compact(elem.title) === ucCompactName);
        if (found) {
          const configUrl = found.config_url;
          const moocConfig = await axios.get(configUrl);
          this.moocFullWeeks = moocConfig.data;
          return moocConfig.data;
        }
      } else {
        console.error('No mooc name was passed as argument');
      }
      return null;
    },
    async getWeekInfo(ucCompactName, weekCompactName) {
      // ucCompactName: is the name of the mooc without spaces
      // weekCompactName: is the name of the week without spaces
      if (!this.moocFullWeeks) {
        this.moocFullWeeks = await this.getMoocFullConfig(ucCompactName);
      }
      this.moocWeek = this.moocFullWeeks.find(elem => this.compact(elem.title) === weekCompactName);
      return this.moocWeek;
    },
    compact(name) {
      return name.toLowerCase().replace(/ /g, '');
    },
  },
};
