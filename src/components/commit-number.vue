
<template>
  <span v-if="isDev" class="commit blink_me">
    Website based on commit:
    <a class="no-link" :href="commitLink">{{commitMessage}}</a>
  </span>
</template>

<script>
  const REPO_URL = 'https://github.com/antonelepfl/usecases/commit/'

  export default {
    name: 'commit-number',
    data () {
      return {
        commitLink: REPO_URL + process.env.TRAVIS_COMMIT,
        isDev: process.env.DEV_WEBSITE,
        commitMessage: process.env.TRAVIS_COMMIT_MESSAGE
      }
    }
  }
</script>

<style scoped>
  .commit {
    color: yellow;
    float: right;
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
