
export default {
  state: {
    header: {}
  },
  setToken (token) {
    console.debug('Settin Authorization Header')
    this.state.header = {headers: {'Authorization': 'Bearer ' + token}}
  }
}
