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
import { getUrlWithoutToken } from '@/mixins/utils';

export default {
  name: 'startapp',
  watch: {
    $route() {
      /*
       * check if the access_token is in the URL and remove it to avoid
       * going to another page that consider access_token as param
       */
      if (!window.location.href.includes('access_token')) return;
      window.location.href = getUrlWithoutToken(window.location.href);
    },
  },
};
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
