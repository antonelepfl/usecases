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
  name: 'startapp'
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
