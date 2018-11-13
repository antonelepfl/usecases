
<template>
  <a
    v-if="uc.tutorial"
    class="no-link inline"
    @click="playTutorial"
    :link="uc.tutorial"
  >
    <div class="divider"/>
    <div class="video-tutorial-container">
      <i class="material-icons">ondemand_video</i>
      <span>Interactive Tutorial</span>
      <md-tooltip md-direction="left">How to use this use case</md-tooltip>
    </div>
  </a>
</template>


<script>
  export default {
    name: 'video-tutorial',
    props: ['uc'],
    methods: {
      playTutorial(event) {
        event.stopPropagation();
        const win = window.open(this.uc.tutorial, '_blank');
        win.focus();
      },
    },
  };
</script>


<style scoped>
  .md-theme-default a.no-link {
    text-decoration: none;
    color: black;
  }
  .inline {
    display: inline-flex;
  }
  .video-tutorial-container {
    display: flex;
    flex-direction: column;
    width: 80px;
  }
</style>
