
/* eslint-disable no-param-reassign */

import uuid from 'uuid4';
import usecases from '@/assets/config_files/usecases.json';
import { getUsecaseInfo, replaceConfirmation, compactString } from '@/mixins/utils';
import store from '@/mixins/store';
import find from 'lodash/find';
import commonConfig from '@/../production_notebooks/common_header/common-config.json';
import collabAuthentication from './collabAuthentication';

const SERVICES_BASE = 'https://services.humanbrainproject.eu';
const COLLAB_API = `${SERVICES_BASE}/collab/v0/`;
const COLLAB_STORAGE_API = `${SERVICES_BASE}/storage/v1/api/project/?collab_id=`;
const STORAGE_FILE_API = `${SERVICES_BASE}/storage/v1/api/file/`;
const STORAGE_BY_QUERY_PARAM = `${SERVICES_BASE}/storage/v1/api/entity/`;
const COLLAB_HOME = 'https://collab.humanbrainproject.eu/#/collab/';
const USER_API = `${SERVICES_BASE}/idm/v1/api/user/me`;
const JUPYTER_NOTEBOOK_APP_ID = 175;
const ABORT_AND_REDIRECT = 'abort and redirect';
const TERMS_FORM = 'https://docs.google.com/forms/u/1/d/e/1FAIpQLSdd8gMoS5Ki-3o9cdqwmqU9-wgtzMGNKusamSoK-L3wsQPWnA/formResponse';
const ACTIVITY_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSc6u9NerFcvI_4Duh1N4LyV48pDi8Mjq0xYGWJzOPBaJ9FjWw/formResponse';

export default {
  data() {
    return {
      errorMessage: '',
      usecases: usecases[0],
      header: store.state.header,
      userInfo: null,
    };
  },
  methods: {
    searchCollab(param) {
      const that = this;
      return new Promise(((resolve, reject) => {
        that.$http.get(`${COLLAB_API}mycollabs/?search=${param}`, that.header)
          .then((response) => {
            if (param.length > 0) {
              resolve(response.data.results);
            }
          },
          (error) => {
            if (error.response.status === 401) {
              collabAuthentication.renewToken(); // force renew token
              reject(error);
            } else {
              reject(error);
            }
          });
      }));
    },
    async createNavEntry(entryName, collabId, parentId, appId, fileId, order) {
      const generateRequest = () => {
        const newContext = uuid();
        const navOrder = order || '-1';
        const type = 'IT';
        const payload = {
          app_id: appId,
          context: newContext,
          name: entryName,
          order_index: navOrder,
          parent: parentId,
          type,
        };
        const collabReq = `${COLLAB_API}collab/${collabId}/nav/`;
        return this.$http.post(collabReq, payload, this.header); // create navitem
      };

      const tryToFindExisting = () => {
        let response = null;
        const found = store.state.allNavItems.children.find(nav => nav.name === entryName);
        if (found) {
          response = Promise.resolve({ data: found });
          console.debug('Reusing existing nav item');
        } else {
          response = generateRequest();
        }
        return response;
      };

      const request = store.state.allNavItems && store.state.rewriteFiles
        ? tryToFindExisting()
        : generateRequest();
      const navItem = await request;
      const navitemId = navItem.data.id;
      const { context } = navItem.data;
      if (appId === JUPYTER_NOTEBOOK_APP_ID) {
        await this.fillJupyterNavItem(fileId, navitemId, collabId, context);
        console.debug('Nav entry created');
        return { collabId, navitemId, entryName };
      }
      console.debug('Nav entry created');
      return { collabId, navitemId };
    },
    async fillJupyterNavItem(fileId, navitemId, collabId, context) {
      const jupyterNotebookUrl = `${STORAGE_FILE_API + fileId}/metadata/`;
      const context2 = `ctx_${context}`;
      const payload = {};
      payload[context2] = 1; // adding context to the entry
      try {
        // change the metadata jupyter file
        await this.$http.put(jupyterNotebookUrl, payload, this.header);
      } catch (error) {
        console.error(error);
        throw new Error('Error changing the metadata:');
      }
      console.debug('Change metadata file <-> navitem');
    },
    async createCollab(collabTitle, isPrivate) {
      const collabReq = `${COLLAB_API}collab/`;
      const payload = {
        title: collabTitle,
        private: isPrivate,
        content: collabTitle,
      };
      let response;
      try {
        response = await this.$http.post(collabReq, payload, this.header);
      } catch (error) {
        if (
          error.response.data
          && error.response.data.title
          && error.response.data.title[0] === 'collab with this title already exists.'
        ) {
          throw new Error('Collab already exist');
        } else if (error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        }
        throw new Error(error);
      }
      const collabInfo = response.data;
      console.debug('Collab created');
      return collabInfo;
    },
    getNavRoot(collabId) {
      const url = `${COLLAB_API}collab/${collabId}/nav/root/`;
      const that = this;
      return new Promise(((resolve) => {
        that.$http.get(url, that.header).then((response) => {
          const parentRoot = response.data.id;
          const nav = { root: parentRoot, collabId };
          console.debug('Get nav root obtained');
          resolve(nav);
        }, (error) => {
          console.error(error);
          throw new Error('Error obtaining the nav root');
        });
      }));
    },
    async getAllNav(collabId) {
      const url = `${COLLAB_API}collab/${collabId}/nav/root/`;
      let response;
      try {
        response = await this.$http.get(url, this.header);
      } catch (error) {
        console.error(error);
        throw new Error('Error get nav root');
      }
      const nav = response.data;
      console.debug('Get all nav obtained');
      store.setAllNavItems(nav);
      return nav;
    },
    redirectToCollab(collabId, navitemId) {
      let path = '';
      if (navitemId) {
        path = `${COLLAB_HOME + collabId}/nav/${navitemId}`;
      } else {
        path = COLLAB_HOME + collabId;
      }
      console.log('Redirecting to ', path);
      // reset the variables
      store.setRewriteFiles(false);
      store.setAllNavItems({});

      if (window !== window.top) {
        // inside iframe
        window.parent.postMessage({ eventName: 'location', data: { url: path } }, '*');
      } else {
        window.location.href = path;
      }
    },
    async getCollabStorage(collabId) {
      const url = COLLAB_STORAGE_API + collabId;
      const newHeader = {
        headers: {
          Authorization: this.header.headers.Authorization,
          Accept: 'application/json',
        },
      };
      let response;
      try {
        response = await this.$http.get(url, newHeader);
      } catch (error) {
        console.error(error);
        throw new Error('Error getting collab storage');
      }
      console.debug('Collab storage obtained');
      store.setCollabInfo(response.data.results[0]);
      return response.data;
    },
    getFileByName(collabId, fileName) {
      const url = `${STORAGE_BY_QUERY_PARAM}?path=/${collabId}/${fileName}`;
      const that = this;
      return new Promise(((resolve, reject) => {
        const newHeader = {
          headers: {
            Authorization: that.header.headers.Authorization,
            Accept: 'application/json',
          },
        };
        that.$http.get(url, newHeader).then((response) => {
          console.debug('File by name retrieved');
          resolve(response.data);
        }, reject);
      }));
    },
    getFileByEnv(info) {
      if (store.state.devWebsite) return info.file;
      const fileToFetch = info.file_prod || info.file;
      if (store.state.stagingWebsite) {
        return fileToFetch.includes('.ipynb')
          ? fileToFetch.replace('ipynb?ref=master', 'ipynb?ref=dev')
          : fileToFetch;
      }
      return fileToFetch;
    },
    async createFile(name, contentType, extension, parent, collabId) {
      const url = STORAGE_FILE_API;
      const payload = {
        name: name + extension,
        content_type: contentType,
        parent,
      };
      const newHeader = {
        headers: {
          Authorization: this.header.headers.Authorization,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };

      let response;
      try {
        response = await this.$http.post(url, payload, newHeader);
      } catch (error) {
        const errorMessage = error.response.data[0];
        if (errorMessage && errorMessage.startsWith('File with the same name')) {
          // get the id of the existing file
          if (!collabId) throw new Error('No collab information');
          let file;
          try {
            file = await this.getFileByName(collabId, name + extension);
          } catch (retrieveError) {
            console.error(retrieveError);
            throw new Error('Error retrieving  a file by name');
          }
          file.exists = true;
          return file;
        }
        console.error(error);
        throw new Error('Error creating a file');
      }
      console.debug('File created');
      return response.data;
    },
    async addCommonHeaderCells(content, fileUrl, sha) {
      console.debug('***** add common header cells *****');
      let url = null;
      let headerFile = null;
      if (store.state.devWebsite) {
        url = commonConfig.commonHeader.dev;
      } else {
        url = commonConfig.commonHeader.prod || commonConfig.commonHeader.dev;
      }

      try {
        headerFile = await this.$http.get(url);
      } catch (error) {
        console.error(error);
        throw new Error('Error getting github common header file');
      }
      content.cells.unshift(...headerFile.data.cells);

      return JSON.stringify(content)
        .replace('NOTEBOOK_ID', sha)
        .replace('NOTEBOOK_URL', fileUrl);
    },
    async copyFileContent(originFileId, newFileId) {
      console.debug('Put content to file');
      if (originFileId.includes('://')) {
        console.debug('Putting content of notebook from github');
        // it's from github
        const { content, sha } = await this.getDataFromRepo(originFileId);
        const notebookWithHeaderStr = await this.addCommonHeaderCells(content, originFileId, sha);
        await this.setFileContent(newFileId, notebookWithHeaderStr);
      } else {
        console.debug('Putting content of notebook from Collab storage');
        // it's from the Collab storage
        const url = `${STORAGE_FILE_API + newFileId}/content/`;
        const newHeader = {
          headers: {
            Authorization: this.header.headers.Authorization,
            'X-Copy-From': originFileId,
            Accept: 'application/json',
          },
        };
        try {
          await this.$http.put(url, null, newHeader);
        } catch (error) {
          console.error('Error copying the file content', error);
          throw new Error(`Error copying the file: ${originFileId}`);
        }
        console.debug('File content copied');
      }
      return newFileId;
    },
    async generateNotebook(collabId, appInfo, parentNav) {
      /* this function creates a file, copy the content of the file
      into new app and create a navitem for that file */
      const projectStorage = await this.getCollabStorage(collabId);
      const parent = projectStorage.results[0].uuid;
      const name = appInfo.entryname;
      const file = await this.createFile(name, appInfo.contenttype, appInfo.extension, parent, collabId);
      const newFileId = await this.copyFileContent(this.getFileByEnv(appInfo), file.uuid);
      const collabInfo = appInfo.justcopy
        ? { collabId }
        : await this.createNavEntry(appInfo.entryname, collabId, parentNav.id, appInfo.appid, newFileId);
      return collabInfo;
    },
    async createItemInExistingCollab(collab, uc, ucInfo) {
      if (!ucInfo) { ucInfo = getUsecaseInfo(`${uc}`); }
      if (ucInfo === undefined) throw new Error(`No usecase named: ${uc}`);

      const creationItemsPromises = await this.createMultipleItemsInExistingCollab(collab, ucInfo);
      const items = await Promise.all(creationItemsPromises);
      const item = items.find(i => i.navitemId) || items[0];
      if (item.collabId) {
        this.redirectToCollab(item.collabId, item.navitemId);
        return true;
      }
      return false;
    },
    async createMultipleItemsInExistingCollab(collab, ucInfo) {
      const parentNav = await this.getAllNav(collab.id);
      const crationPromises = [];
      const isReplace = await this.replaceExistsDialog(parentNav, ucInfo.files);
      if (!isReplace) { // go directly to collab
        console.debug(ABORT_AND_REDIRECT);
        this.abortAndRedirect(collab, ucInfo);
      }
      ucInfo.files.forEach((item) => {
        // otherwise create = replace
        if (item.appid === JUPYTER_NOTEBOOK_APP_ID) {
          crationPromises.push(this.generateNotebook(collab.id, item, parentNav));
        } else { // is not jupyter notebok just connect to the original file
          crationPromises.push(this.createNavEntry(item.entryname, collab.id, parentNav.id, item.appid));
        }
      });
      return crationPromises;
    },
    checkExists(nav, appId, appName) {
      if (!nav.children) return null;
      const item = { found: false, navitemId: undefined };
      let i = 0;
      while (!item.found && nav.children.length > i) {
        if (nav.children[i].app_id === appId.toString()
          && nav.children[i].name === appName) {
          item.found = true;
          item.entryname = appName;
          item.navitemId = nav.children[i].id;
          item.navitemContext = nav.children[i].context;
        }
        i += 1;
      }
      return item;
    },
    replaceExistsDialog(nav, filesChildren) {
      /* find the same name of the existing navs and new files
       * if finds a popup will apear to the user for replace or generate new files
      * */
      let promise = null;
      let found = null;
      if (nav.children && nav.children.length > 0) {
        if (Array.isArray(filesChildren)) {
          found = filesChildren.find(file => nav.children.find(navitem => (file.entryname === navitem.name)));
        } else {
          found = nav.children.find(navitem => (filesChildren.entryname === navitem.name));
        }

        if (found && !store.state.rewriteFiles) {
          promise = replaceConfirmation();
        } else {
          console.debug('Not item found. creating from scratch');
          promise = Promise.resolve(true);
        }
      }

      if (!promise) { throw Error('Replace Exists Dialog'); }
      return promise.then((isReplace = false) => {
        store.setRewriteFiles(isReplace);
        return isReplace || false;
      });
    },
    findInitialInNavitems(nav, filesChildren) {
      /* find the initial navitem in the existings navitems * */
      if (nav.children && nav.children.length > 0) {
        const filesChildrenIsArray = Array.isArray(filesChildren);
        let initialName = null;
        if (filesChildrenIsArray && filesChildren.length > 1) {
          initialName = filesChildren.find(file => (file.initial));
          if (initialName) {
            initialName = initialName.entryname;
          } else {
            console.warn('No initial was set in usecases.json');
          }
        } else {
          initialName = filesChildren.entryname || filesChildren[0].entryname;
        }

        const found = nav.children.find(navitem => (initialName === navitem.name));
        if (found) {
          console.debug('Initial Navitem found', found.name);
          return found.id;
        }
      }
      return null;
    },
    async getFileContent(fileId) {
      let response = null;
      try {
        response = fileId.includes('://')
          ? await this.getDataFromRepo(fileId)
          : await this.$http.get(`${STORAGE_FILE_API + fileId}/content/`, this.header);
        if (!response) throw new Error('no response data from github');
      } catch (error) {
        console.error(error);
        throw new Error('Error getting file content');
      }
      if (response.sha) {
        // production notebooks
        return this.addCommonHeaderCells(response.content, fileId, response.sha);
      }
      return response.data;
    },
    setFileContent(fileId, content) {
      const that = this;
      return new Promise(((resolve, reject) => {
        that.$http.post(`${STORAGE_FILE_API + fileId}/content/upload/`, content, that.header)
          .then(() => {
            resolve(fileId);
          },
          (responseError) => {
            reject(responseError);
          });
      }));
    },
    async getUserInfo() {
      if (this.userInfo) return this.userInfo;
      try {
        const response = await this.$http.get(USER_API, store.state.header);
        this.userInfo = response.data;
      } catch (error) {
        if (error.response.status === 401) {
          collabAuthentication.renewToken(true); // force renew token
          console.error(error);
          throw new Error('Error (401) getting user info');
        } else {
          console.error(error);
          throw new Error('Error getting user info');
        }
      }
      return this.userInfo;
    },
    async replaceContentAndCopy(findString, replaceString, collabId, appInfo, parentNav) {
      /* this function takes a string and replace for another inside a file the content of the app
      into new app and create a navitem for that file */
      let replacedFileContent = '';
      const fileContent = await this.getFileContent(this.getFileByEnv(appInfo));
      replacedFileContent = JSON.stringify(fileContent);
      replacedFileContent = replacedFileContent.replace(findString, replaceString);
      const projectStorage = await this.getCollabStorage(collabId);
      const parent = projectStorage.results[0].uuid;
      const entryName = appInfo.entryname;
      const file = await this.createFile(entryName, appInfo.contenttype, appInfo.extension, parent, collabId);
      const newFileId = await this.setFileContent(file.uuid, JSON.parse(replacedFileContent));
      return this.createNavEntry(entryName, collabId, parentNav.id, appInfo.appid, newFileId);
    },
    async createItemInExistingCollabWithReplace(collab, uc, modelName, findString) {
      const ucInfo = getUsecaseInfo(uc);
      const parentNav = await this.getAllNav(collab.id);
      const promisesArray = [];
      if (ucInfo === undefined) {
        console.error('No usecase named', uc);
        throw new Error('No usecase named:', uc);
      }
      const isReplace = await this.replaceExistsDialog(parentNav, ucInfo.files);
      if (!isReplace) {
        console.debug(ABORT_AND_REDIRECT);
        this.abortAndRedirect(collab, ucInfo);
      }
      ucInfo.files.forEach((item) => {
        if (item.appid === JUPYTER_NOTEBOOK_APP_ID) {
          promisesArray.push(this.replaceContentAndCopy(findString, modelName, collab.id, item, parentNav));
        } else { // is not jupyter notebok just connect to the original file
          promisesArray.push(this.createNavEntry(item.entryname, collab.id, parentNav.id, item.appid));
        }
      });
      await Promise.all(promisesArray);
      const generatedNotebooks = await Promise.all(promisesArray);
      const obj = generatedNotebooks[0];
      if (obj === undefined) {
        this.redirectToCollab(collab.id);
      } else if (obj && obj.collabId) {
        this.redirectToCollab(obj.collabId, obj.navitemId);
      }
    },
    sendStatistics(collabId, ucName, fullModelName, isNew) {
      if (store.state.devWebsite || store.state.stagingWebsite) { return; }

      const searchCategoryAndFullTitleRecursively = () => {
        let fullUCName = '';
        let categoryName = '';
        find(usecases[0], (categoryValue, categoryKey) => (
          find(categoryValue, (ucInfo) => {
            const titleCompressed = compactString(ucInfo.title);
            if (titleCompressed === ucName) {
              fullUCName = ucInfo.title;
              categoryName = categoryKey;
              return true;
            }
            return false;
          })
        ));
        return { fullUCName, categoryName };
      };

      const { fullUCName, categoryName } = searchCategoryAndFullTitleRecursively();
      if (!fullUCName) {
        console.warn('Title of the UC do not found');
      }
      const userEntry = 'entry.1933333390';
      /* eslint no-undef: 0 */
      const formData = new URLSearchParams();
      const collabCreated = (isNew) ? 'Create' : 'Add';
      formData.append('entry.724323063', collabCreated);
      formData.append('entry.1219332324', fullUCName);
      formData.append('entry.2088231351', fullModelName);
      formData.append('entry.748800890', collabId);
      formData.append('entry.2065854000', categoryName);
      this.sendToForm(formData, ACTIVITY_FORM, userEntry);
    },
    sendToForm(formData, url, userEntry) {
      if (store.state.devWebsite || store.state.stagingWebsite) { return; }

      const send = () => {
        const options = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        };
        this.$http.post(url, formData.toString(), options)
          .catch(() => {});
      };

      const getInfoAndSend = () => {
        this.getUserInfo().then((user) => {
          formData.append(userEntry, user.id);
          console.debug('Send usage statistic to form');
          send();
        });
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          getInfoAndSend();
        }, { timeout: 1000 });
      } else {
        getInfoAndSend();
      }
    },
    sendAcceptTerms(choice) {
      /* eslint no-undef: 0 */
      const formData = new URLSearchParams();
      const userEntry = 'entry.974372560';
      formData.append('entry.1853154584', choice);
      console.debug('Send acceptance Terms & Conditions to form');
      this.sendToForm(formData, TERMS_FORM, userEntry);
    },
    async getDataFromRepo(url) {
      // sha used for check new notebook available in productions notebooks
      const dataObj = { content: null, sha: null };
      if (!url.includes('://')) {
        url = decodeURIComponent(url);
      }
      let response = null;
      try {
        response = await this.$http.get(url);
      } catch (error) {
        console.error(error);
        throw new Error('Error fetching content from Github');
      }
      if (url.includes('contents/production_notebooks')) {
        let decodedContent = '';
        try {
          // This is to avoid enconding issues
          const decoded = decodeURIComponent(escape(atob(response.data.content)));
          decodedContent = JSON.parse(decoded);
        } catch (error) {
          console.error(error);
          throw new Error('Error parsing Github content');
        }
        dataObj.content = decodedContent;
        dataObj.sha = response.data.sha;
      } else {
        dataObj.content = response.data;
      }
      return dataObj;
    },
    addCollabMemeber(collabId, userId) {
      const that = this;
      return new Promise(((resolve, reject) => {
        const url = `${COLLAB_API}collab/${collabId}/team/`;
        const payload = { users: [userId] };
        that.$http.put(url, payload, that.header).then((team) => {
          resolve(team);
        }, reject);
      }));
    },
    abortAndRedirect(collab, ucInfo) {
      console.debug('Do not replace. Redirect to collab');
      const initialNavId = this.findInitialInNavitems(store.state.allNavItems, ucInfo.files);
      this.redirectToCollab(collab.id, initialNavId);
      this.isLoading = false;
      throw String('Redirecting...');
    },
  },
};
