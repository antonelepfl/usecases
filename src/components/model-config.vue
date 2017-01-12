<template>
    <div class="model-config">
        <h1>Model Configuration</h1>
        <md-input-container>
            <label>Generations</label>
            <md-input type="number"></md-input>
        </md-input-container>
        <md-input-container>
            <label>Offsprings</label>
            <md-input type="number"></md-input>
        </md-input-container>
        <navigation-buttons 
            v-bind:prev='configroutes.times' 
            v-bind:next='configroutes.traces'></navigation-buttons>
    </div>
</template>
<script>
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import NavigationButtons from './navigation-buttons'
var configroutes = require('../assets/routes.json')

Vue.use(VueMaterial)

export default {
  name: 'model-config',
  data () {
    return {
        configroutes: configroutes
    }
  },
  components: {
    NavigationButtons
  }
}
</script>
<style>
.model-config {
    padding: 20px;
}
</style>