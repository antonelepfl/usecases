<template>
  <div></div>
</template>

<script>
  import CollabAuthentication from 'mixins/collabAuthentication'
  import store from 'mixins/store.js'
  export default {
    name: 'login',
    mounted () {
      let auth = CollabAuthentication
      auth.methods.login('page')
      .then((token) => {
        store.setToken(token);
        if (window.localStorage.query) {
          window.location.hash = '/' + window.localStorage.query
        } else {
          console.error('NO SessionStorage')
          throw Error('Login component. No SessionStorage')
        }
      })
    }
  }
</script>
