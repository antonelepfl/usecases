<template>
  <div>Please Wait ...</div>
</template>

<script>
  import CollabAuthentication from '@/mixins/collabAuthentication'
  import store from '@/mixins/store.js'
  export default {
    name: 'login',
    mounted () {
      let auth = CollabAuthentication
      let authenticated = auth.methods.getAuthResponse()
      if (authenticated) {
        this.recoverQueryParams()
        return
      }
      auth.methods.login('page')
      .then((token) => {
        store.setToken(token);
        this.recoverQueryParams()
      })
    },
    methods: {
      recoverQueryParams () {
        if (window.localStorage.query) {
          window.location.hash = '/' + window.localStorage.query
        } else {
          console.warn('NO SessionStorage')
          window.location.hash = '/traceanalysis'
        }
      }
    }
  }
</script>
