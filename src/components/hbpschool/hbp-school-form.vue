<template>
  <div class="mooc-form">
    <div class="title-uc">{{schoolName}}</div>

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
        <md-input v-model.lazy="searchText"></md-input>
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
import { getUsecaseInfo } from '@/mixins/utils';

export default {
  name: 'hbpSchoolForm',
  data() {
    return {
      searchText: '',
      schoolName: 'HBP School',
      isLoading: false,
      errorMessage: '',
      isLoadingLocal: false,
      collabResults: [],
      collabCreationProgress: 0,
      fullCollabName: '',
      timeoutId: 0,
    };
  },
  props: ['uc_name'],
  mixins: [mooc], // use common functions
  methods: {
    async createNewCollab() {
      const isPrivate = false;
      this.isLoading = true;
      this.errorMessage = '';
      this.collabCreationProgress = 10;
      let collab = null;

      try {
        collab = await this.createMoocCollab(isPrivate, this.fullCollabName);
      } catch (error) {
        this.errorMessage = error.message;
        this.isLoadingLocal = false;
        return;
      }

      try {
        await this.createCoursesSchool(collab, this.uc_name);
      } catch (error) {
        this.errorMessage = `Error during course creation: ${error.message}`;
        this.isLoadingLocal = false;
        return;
      }

      this.sendStatistics(collab.id, this.uc_name, this.schoolName, true);
      this.collabCreationProgress = 100;
      this.isLoadingLocal = false;
    },
    async collabSelected(collab) {
      this.isLoadingLocal = true;
      this.collabCreationProgress = 10;
      try {
        await this.createCoursesSchool(collab, this.uc_name);
        this.sendStatistics(collab.id, this.uc_name, this.schoolName, false);
      } catch (error) {
        console.error(error);
        this.errorMessage = error.message;
      }
      this.isLoadingLocal = false;
    },
    async updateFullCollabName(searchText, schoolName) {
      if (searchText !== '') {
        this.fullCollabName = searchText;
      } else {
        let user = null;
        try {
          user = await this.getUserInfo();
        } catch (e) {
          console.error(e);
          this.errorMessage = e.message;
        }
        const d = new Date().toLocaleString();
        this.fullCollabName = `${schoolName} - ${user.familyName} ${d}`;
      }
    },

    async createCoursesSchool(collab, uc) {
      this.schoolInfo = getUsecaseInfo(uc);
      return this.createGenericCourses(collab, this.schoolInfo);
    },
  },
  mounted() {
    this.$nextTick(() => { // waits until token is saved in mixins headers
      this.updateFullCollabName(this.searchText, this.schoolName);
    });
  },
  watch: {
    searchText(newVal) {
      this.updateFullCollabName(this.searchText, this.schoolName);
      clearTimeout(this.timeoutId);
      if (newVal === '') {
        this.collabResults = [];
        this.errorMessage = '';
        this.isLoadingLocal = false;
        return;
      }
      this.timeoutId = setTimeout(() => {
        this.isLoadingLocal = true;
        this.searchCollab(newVal).then((result) => {
          if (this.errorMessage !== '') {
            this.errorMessage = '';
          }
          if (result.length === 0) {
            this.collabResults = [{ title: 'No found' }];
          } else {
            this.collabResults = result;
          }
          this.isLoadingLocal = false;
        }).catch(() => {
          this.errorMessage = 'Getting your collabs ...';
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
</style>
