<template>
  <div class="startapp" v-if="!loading">
    <uc-container key="container" :next="next"></uc-container>
  </div>
</template>

<script>
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import Vue from 'vue'
import ucContainer from './traceanalysis/uc-container.vue'
import CollabAuthentication from '../mixins/collabAuthentication.js'

Vue.use(VueMaterial)

export default {
  name: 'startapp',
  components: {
    ucContainer, VueMaterial
  },
  data () {
    return {
      single: Boolean,
      next: '',
      loading: true
    }
  },
  props: ['list_usecases'],
  mixins: [CollabAuthentication],
  created () {
    var that = this
    var helloLocal = window.localStorage.hello
    if (!helloLocal || helloLocal.length === 2) { // is empty {}
      this.login().then(function () {  // from CollabAuthentication
        that.loading = false
      })
    } else {
      this.loading = false
    }
    switch (this.list_usecases) {
      case 'traceanalysis':
        this.next = this.$route.path + '/form/'
        break
      case 'singlecellmodeling':
        this.next = this.$route.path + '/smmodels/'
        break
      case 'circuitbuilding':
        this.next = this.$route.path + '/cbmodels/'
        break
    }
  }
}
</script>

<style>
  .startapp {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
