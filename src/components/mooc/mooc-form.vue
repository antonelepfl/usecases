<template>
  <div class="mooc-form">
    <div class="title-uc">{{moocName}}</div>

    <md-whiteframe md-tag="section" class="body-mooc">
      <md-button
        class="md-raised md-primary"
        @click.native="createNewCollab"
        :disabled="fullCollabName === ''"
      >
        Create a collab
      </md-button>
      <div class="small-label">{{fullCollabName}}</div>
      <div v-show="isLoading" class="progress-bar">
        <md-progress class="md-accent" :md-progress="collabCreationProgress"></md-progress>
      </div>

      <div class="separator"><label>OR</label></div>
      <b>Search for an existing collab</b>

      <md-input-container>
        <label>Collab Name</label>
        <md-input placeholder="Mooc" v-model.lazy="searchText"></md-input>
      </md-input-container>
      <div v-show="!isLoadingLocal" class="collabs-results-container">
        <div v-for="collab in collabResults" :key="collab.title" class="collab-result" >
          <a class="nota" @click="collabSelected(collab)">{{ collab.title }}</a>
        </div>
      </div>
      <div v-show="isLoadingLocal" class="progress-bar">
        <md-progress class="md-accent" :md-progress="collabCreationProgress"></md-progress>
      </div>

      <div class="error">
        {{errorMessage}}
      </div>
    </md-whiteframe>
  </div>
</template>

<script>
import mooc from '@/mixins/mooc';

export default {
  name: 'moocForm',
  data() {
    return {
      private: true,
      searchText: '',
      moocName: this.$route.params.moocFullName,
      isLoading: false,
      errorMessage: '',
      isLoadingLocal: false,
      collabResults: [],
      collabCreationProgress: 0,
      fullCollabName: '',
      timeoutId: 0,
      weekNumber: null,
    };
  },
  props: ['uc_name', 'week'],
  mixins: [mooc], // use common functions
  methods: {
    async createNewCollab() {
      const that = this;
      const isPrivate = false;
      this.isLoading = true;
      this.errorMessage = '';
      this.collabCreationProgress = 10;
      try {
        const collab = await this.createMoocCollab(isPrivate, this.fullCollabName);
        const prettyWeek = `Week ${this.weekNumber}`;
        const category = this.$route.path.split('/')[1];
        await that.createCoursesMooc(collab, that.uc_name, this.week);
        that.sendStatistics(collab.id, that.uc_name, category, prettyWeek, true);
        that.collabCreationProgress = 100;
        that.isLoading = false;
      } catch (error) {
        if (error.message === 'Collab already exist') {
          that.errorMessage = 'Collab already exist. Please try again';
        } else {
          that.errorMessage = `Error during collab creation: ${error.message}`;
        }
        that.isLoading = false;
      }
    },
    async collabSelected(collab) {
      // const that = this;
      this.isLoadingLocal = true;
      this.collabCreationProgress = 10;
      const prettyWeek = `Week ${this.weekNumber}`;
      const category = this.$route.path.split('/')[1];
      try {
        await this.addMoocExistingCollab(collab, this.uc_name, this.week);
        this.sendStatistics(collab.id, this.uc_name, category, prettyWeek, false);
      } catch (error) {
        console.error(error);
        this.errorMessage = error.message;
      }
      this.isLoadingLocal = false;
    },
  },
  mounted() {
    this.$nextTick(() => { // waits until token is saved in mixins headers
      [this.weekNumber] = this.week.match(/\d+/);
      this.updateFullCollabName(this.searchText, this.moocName, this.weekNumber)
        .catch((error) => {
          this.errorMessage = error.message;
          this.isLoadingLocal = false;
        });
    });
  },
  watch: {
    searchText(newVal) {
      const that = this;
      this.updateFullCollabName(this.searchText, this.moocName, this.weekNumber);
      clearTimeout(this.timeoutId);
      if (newVal === '') {
        that.collabResults = [];
        that.errorMessage = '';
        that.isLoadingLocal = false;
        return;
      }
      this.timeoutId = setTimeout(() => {
        that.isLoadingLocal = true;
        that.searchCollab(newVal).then((result) => {
          if (that.errorMessage !== '') {
            that.errorMessage = '';
          }
          if (result.length === 0) {
            that.collabResults = [{ title: 'No found' }];
          } else {
            that.collabResults = result;
          }
          that.isLoadingLocal = false;
        }, () => {
          that.errorMessage = 'Getting your collabs ...';
        });
      }, 500);
    },
  },
};
</script>

<style scoped>
  .body-mooc {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 100px auto 0 auto;
    max-width: 500px;
    padding: 10px;
    background-color: rgba(214, 233, 250, 0.2);
    min-height: 280px;
  }
  .progress-bar {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 60%;
  }
  .error {
    color: red;
    text-align: center;
    margin-bottom: 20px;
  }
  .md-theme-default a:not(.md-button):hover {
    color: #1c1c47;
    cursor: pointer;
  }
  .md-theme-default a:not(.md-button) {
    color: #8888cb;
    padding: 10px;
  }
  .body-mooc button {
    margin: 20px;
  }
  .md-theme-default.md-button:not([disabled]).md-primary.md-raised {
    background-color: #74a1c9;
  }
  .separator {
    position: relative;
    text-align: center;
    width: 100%;
    margin: 10px auto;
  }
  .separator label {
    background-color: #f7fbfe;
    padding: 0 0.4em;
    position: relative;
  }
  .separator::before {
    content: '';
    border-style: solid;
    border-width: 0 0 1px 0;
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    border-color:black;
  }
  .small-label {
    font-size: 11px;
  }
  .collabs-results-container {
    max-height: 400px;
    overflow: scroll;
  }
</style>
