<template>
  <div class="startapp">
    <transition-group appear name="fade">
      <uc-container key='container'></uc-container>
    </transition-group>
  </div>
</template>

<script>
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import Vue from 'vue'
import ucContainer from './uc-container.vue'
var configroutes = require('../assets/routes.json')

Vue.use(VueMaterial)

export default {
  name: 'startapp',
  data () {
    return {
      configroutes: configroutes
    }
  },
  components: {
    ucContainer, VueMaterial
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
