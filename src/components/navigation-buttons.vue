<template>
    <div class="navigation-buttons">
        <router-link v-bind:to="prev">
            <md-button class="md-raised md-primary" alt='prev'>Back</md-button>
        </router-link>
        <router-link v-bind:to="next">
            <md-button class="md-raised md-primary" alt='next'>Continue</md-button>
        </router-link>
    </div>
</template>
<script>
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

Vue.use(VueMaterial)

export default {
  name: 'navigation-buttons',
  props: {
    next: {
      type: String,
      default: '/'
    },
    prev: {
      type: String,
      default: '/'
    }
  }
}
</script>

<style>
.navigation-buttons {
    padding: 5px;
    float: right;
}
</style>