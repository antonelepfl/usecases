<template>
  <div class="startapp" v-if="!loading">
    <uc-container key="container"></uc-container>
  </div>
</template>

<script>
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import Vue from 'vue'
import ucContainer from 'components/uc/uc-container.vue'
import CollabAuthentication from 'mixins/collabAuthentication.js'

Vue.use(VueMaterial)

export default {
  name: 'startapp',
  components: {
    ucContainer, VueMaterial
  },
  data () {
    return {
      loading: true
    }
  },
  props: ['list_usecases'],
  mixins: [CollabAuthentication],
  created () {
    var that = this
    this.login().then(function () {  // from CollabAuthentication
      that.loading = false
    }, function (error) {
      console.error(error)
      that.isLoading = false
    })
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
