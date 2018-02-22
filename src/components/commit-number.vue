
<template>
  <span v-if="isDev" class="commit">
    Website based on commit:
    <a class="no-link" href="#">{{test}}</a>
  </span>
</template>

<script>
  const REPO_URL = 'https://github.com/antonelepfl/usecases/commit/'

  export default {
    name: 'commit-number',
    data () {
      return {
        test: process.env.TRAVIS_BRANCH
        // commitLink: REPO_URL + process.env.TRAVIS_COMMIT,
        // isDev: process.env.DEV_WEBSITE,
        // commitMessage: process.env.TRAVIS_COMMIT_MESSAGE
      }
    }
  }
</script>

<style scoped>
  .commit {
    color: white;
    float: right;
  }
  .commit a.no-link {
    text-decoration: none;
    color: inherit;
  }
</style>
