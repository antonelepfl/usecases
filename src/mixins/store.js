
export default {
  state: {
    header: {}
  },
  setToken (token) {
    console.debug('Setting Authorization Header')
    this.state.header = {headers: {'Authorization': 'Bearer ' + token}}
  }
}
