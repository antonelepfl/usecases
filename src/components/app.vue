<template>
  <div class="startapp">
    <uc-container key="container" v-if="authenticated"></uc-container>
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
    'uc-container': ucContainer
  },
  data () {
    return {
      authenticated: false
    }
  },
  props: ['list_usecases'],
  mixins: [CollabAuthentication]
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
