<template>
  <div class="startapp">
    <uc-container key='container'></uc-container>
  </div>
</template>

<script>
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import Vue from 'vue'
import ucContainer from './uc-container.vue'

Vue.use(VueMaterial)

export default {
  name: 'startapp',
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
</style>
