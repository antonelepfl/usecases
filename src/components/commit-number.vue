
<template>
  <div class="inline-flex" v-if="isDev || isStaging">

    <div class="colored blinking short-text">
      <div v-if="isDev">
        Using Commit
        <a class="no-link" :href="commitLink">
          {{commitNumber}}
        </a>
      </div>

      <div v-if="isStaging">
        Using Github
        <a class="no-link" :href="stagingNotebooksLink">
          Notebooks
        </a>
      </div>
    </div>

    <div class="switch">
      <span>Dev</span>
      <md-switch
        v-model="isStaging"
        class="md-primary small"
        md-theme="white"
      ></md-switch>
      <span>Staging</span>
    </div>

  </div>
</template>

<script>
import store from '@/mixins/store';
import constants from '@/assets/config_files/constants';

export default {
  name: 'commit-number',
  data() {
    return {
      commitLink: `${constants.COMMIT_URL}${store.state.commitNumber}`,
      isDev: store.state.devWebsite,
      isStaging: store.state.stagingWebsite,
      commitNumber: store.state.commitNumber ? store.state.commitNumber.substr(0, 10) : '???',
      stagingNotebooksLink: constants.COMMIT_NOTEBOOKS.replace('<COMMIT_PLACEHOLDER>', store.state.commitNumber),
    };
  },
  watch: {
    isStaging() {
      store.setIsStagingWebsite(this.isStaging);
      localStorage.setItem(constants.IS_STAGING, this.isStaging);
      this.isDev = store.state.devWebsite;
    },
  },
};
</script>

<style scoped>
  .short-text {
    max-width: 500px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .colored {
    color: yellow;
  }
  .colored a.no-link {
    text-decoration: none;
    color: inherit;
  }
  .switch {
    margin-left: 10px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
  .blinking {
    animation: blinker 1s linear infinite;
  }
  .inline-flex {
    display: flex;
    align-items: center;
    float: right;
  }
  .inline-flex .small {
    margin: 0 10px;
  }

  @keyframes blinker {
    50% { opacity: 0.1; }
  }
  @media screen and (max-width: 1000px) {
    .short-text {
      max-width: 0px;
    }
  }
</style>
