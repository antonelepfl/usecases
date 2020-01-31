
/* eslint-disable no-console */
/* eslint-disable no-undef */

import constants from '@/assets/config_files/constants';

function getEnvironment() {
  const isProduction = process.env.GIT_BRANCH === 'origin/master';
  let stagingWebsite = false;
  let devWebsite = false;
  if (!isProduction) {
    stagingWebsite = JSON.parse(localStorage.getItem(constants.IS_STAGING) || false);
    if (!stagingWebsite) devWebsite = true;
  }

  return {
    devWebsite,
    stagingWebsite,
  };
}

const envs = getEnvironment();

export default {
  state: {
    header: {},
    collabInfo: {},
    rewriteFiles: false,
    allNavItems: {},
    devWebsite: envs.devWebsite,
    stagingWebsite: envs.stagingWebsite,
    commitNumber: process.env.GIT_COMMIT,
  },
  setToken(token) {
    console.debug('(store) Setting Authorization Header');
    this.state.header = { headers: { Authorization: `Bearer ${token}` } };
  },
  setRewriteFiles(choice) {
    console.debug('(store) Setting RewriteFiles', choice);
    this.state.rewriteFiles = choice;
  },
  setAllNavItems(navItems) {
    console.debug('(store) Setting NavItems');
    this.state.allNavItems = navItems;
  },
  setCollabInfo(info) {
    console.debug('(store) Setting Collab Info');
    this.state.collabInfo = info;
  },
  setIsStagingWebsite(isStaging) {
    this.state.devWebsite = !isStaging;
    this.state.stagingWebsite = isStaging;
  },
  navItemsExist() {
    const hasNav = Object.keys(this.state.allNavItems).length > 0;
    const hasCollabInfo = Object.keys(this.state.collabInfo).length > 0;
    return hasNav && hasCollabInfo;
  },
};
