
<template>
  <div v-if="isDev" class="commit blink_me">
    Website build using commit:
    <a class="no-link shorter" :href="commitLink">
      {{commitNumber}}
    </a>
  </div>
</template>

<script>
  const REPO_URL = 'https://github.com/antonelepfl/usecases/commit/'
  import store from '@/mixins/store.js'

  export default {
    name: 'commit-number',
    data () {
      return {
        commitLink: REPO_URL + store.state.commitNumber,
        isDev: store.state.devWebsite,
        commitNumber: store.state.commitNumber
      }
    }
  }
</script>

<style scoped>
  .commit {
    color: yellow;
    float: right;
    display: inline;
    max-width: 500px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

  }
  .commit a.no-link {
    text-decoration: none;
    color: inherit;
  }
  .blink_me {
    animation: blinker 1s linear infinite;
  }

  @keyframes blinker {  
    50% { opacity: 0.1; }
  }
</style>
