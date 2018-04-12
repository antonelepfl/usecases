
export default {
  state: {
    header: {},
    rewriteFiles: false,
    allNavItems: {}
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
  }
}
