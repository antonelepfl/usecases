<template>
  <div class="startapp">
    <uc-container key="container" :next="next" :single="single"></uc-container>
  </div>
</template>

<script>
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import Vue from 'vue'
import ucContainer from './traceanalysis/uc-container.vue'

Vue.use(VueMaterial)

export default {
  name: 'startapp',
  components: {
    ucContainer, VueMaterial
  },
  data () {
    return {
      single: Boolean,
      next: ''
    }
  },
  props: ['list_usecases'],
  created () {
    switch (this.list_usecases) {
      case 'traceanalysis':
        this.single = true
        this.next = this.$route.path + '/form/'
        break
      case 'singlecellmodeling':
        this.single = false
        this.next = this.$route.path + '/models/'
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
