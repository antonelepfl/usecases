
/* eslint-disable no-console */
/* eslint-disable no-undef */
export default {
  state: {
    header: {},
    collabInfo: {},
    rewriteFiles: false,
    allNavItems: {},
    devWebsite: process.env.GIT_BRANCH != 'origin/master',
    commitNumber: process.env.GIT_COMMIT
  },
  setToken (token) {
    console.debug('(store) Setting Authorization Header')
    this.state.header = {headers: {'Authorization': 'Bearer ' + token}}
  },
  setRewriteFiles (choice) {
    console.debug('(store) Setting RewriteFiles', choice)
    this.state.rewriteFiles = choice
  },
  setAllNavItems (navItems) {
    console.debug('(store) Setting NavItems')
    this.state.allNavItems = navItems
  },
  setCollabInfo (info) {
    console.debug('(store) Setting Collab Info')
    this.state.collabInfo = info
  },
  navItemsExist () {
    let hasNav = Object.keys(this.state.allNavItems).length > 0
    let hasCollabInfo = Object.keys(this.state.collabInfo).length > 0
    return hasNav && hasCollabInfo
  }
}
