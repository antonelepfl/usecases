<template>
  <div class="startapp">
    <transition appear name="fade" mode="out-in">
      <router-view>
        <h2 class="welcome">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </h2>
      </router-view>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'startapp',
  watch: {
    '$route' () {
      /*
       * check if the access_token is in the URL and remove it to avoid
       * going to another page that consider access_token as param
       */
      if (window.location.href.includes('access_token')) {
        console.debug('URL has token, removing it ...');
        const urlParts = window.location.href.split('/');
        urlParts.splice(-1,1);
        window.location.href = urlParts.join('/');
      }
    },
  },
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
