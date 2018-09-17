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
  import mooc from '@/mixins/mooc.js'
  import collabAuthentication from '@/mixins/collabAuthentication.js'
  import usecases from '@/assets/config_files/usecases.json'
  import store from '@/mixins/store.js'

  export default {
    name: 'hbpSchoolForm',
    data () {
      return {
        private: true,
        searchText: '',
        schoolName: 'HBP School',
        isLoading: false,
        errorMessage: '',
        isLoadingLocal: false,
        collabResults: [],
        collabCreationProgress: 0,
        fullCollabName: '',
        timeoutId: 0,
        weekNumber: null
      }
    },
    props: ['uc_name'],
    mixins: [mooc, collabAuthentication], // use common functions
    methods: {
      async createNewCollab () {
        var that = this
        var isPrivate = false
        this.isLoading = true
        this.errorMessage = ''
        this.collabCreationProgress = 10
        try {
          let collab = await this.createMoocCollab(isPrivate, this.fullCollabName)
          var category = this.$route.path.split('/')[1]
          await that.createCoursesSchool(collab, category, that.uc_name)
          that.sendStatistics(collab.id, that.uc_name, category, this.schoolName, true)
          that.collabCreationProgress = 100
          that.isLoading = false
        } catch (error) {
          if (error === 'collab with this title already exists.') {
            console.debug('Collab name already exist')
            that.errorMessage = 'Please try again'
            that.isLoading = false
          } else {
            that.errorMessage = 'Error during collab creation: ' + error
            that.isLoading = false
          }
        }
      },
      async collabSelected (collab) {
        var that = this
        that.isLoadingLocal = true
        this.collabCreationProgress = 10
        try {
          var category = this.$route.path.split('/')[1]
          await this.addSchoolExistingCollab(collab, category, this.uc_name)
          that.sendStatistics(collab.id, that.uc_name, category, this.schoolName, false)
          that.isLoadingLocal = false
        } catch (error) {
          that.errorMessage = error
          that.isLoadingLocal = false
        }
      },
      async updateFullCollabName (searchText, schoolName) {
        try {
          let user = await this.getUserInfo()
          let d = new Date().toLocaleString()
          if (searchText !== '') {
            searchText = searchText + ' - '
          }
          this.fullCollabName = searchText + schoolName + ' - ' + user.displayName + ' ' + d
        } catch (e) { return Promise.reject(e) }
      },
      addSchoolExistingCollab (collab, category, uc) {
        try {
          return this.createCoursesSchool(collab, category, uc)
        } catch (e) { return Promise.reject(e) }
      },
      async createCoursesSchool (collab, category, uc) {
        var that = this
        that.schoolInfo = usecases[0][category].find(elem => (
          this.compact(elem.title) === uc)
        )
        let coursesPromises = []
        try {
          console.debug('before getNavElement')
          await that.getNavElement(collab.id)
          if (that.schoolInfo && that.schoolInfo.files) {
            let isReplace = await that.replaceExistsDialog(store.state.allNavItems, that.schoolInfo.files)
            this.schoolInfo.files.forEach((file) => {
              if (!isReplace) { // no replace. generate new navitem and new file
                throw String('abort and redirect')
              }
              let creat = that.createItemInExistingCollab(collab, file)
              coursesPromises.push(creat)
            })
            let elements = await Promise.all(coursesPromises)
            let emptyNavItemsId = await that.generateNavItems(that.schoolInfo.files, elements)
            let prom = []
            for (let item in emptyNavItemsId) {
              prom.push(that.copyContentToNav(emptyNavItemsId[item]))
            }
            await Promise.all(prom)// populate navitem parallel
            that.collabCreationProgress = that.collabCreationProgress + 5

            that.redirectToCollab(collab.id, that.navitemId)
            await setTimeout(1500) // if it does not redirect stop loading
            return
          }
        } catch (e) {
          that.abortAndRedirect(collab, that.moocWeek, e)
        }
      },
    },
    mounted () {
      let that = this
      this.$nextTick(function () { // waits until token is saved in mixins headers
        // this.weekNumber = this.week.match(/\d+/)[0];
        that.updateFullCollabName(this.searchText, this.schoolName)
      })
    },
    watch: {
      'searchText' (newVal) {
        var that = this
        this.updateFullCollabName(this.searchText, this.schoolName, this.weekNumber)
        clearTimeout(this.timeoutId)
        if (newVal === '') {
          that.collabResults = []
          that.errorMessage = ''
          that.isLoadingLocal = false
          return;
        }
        this.timeoutId = setTimeout(function () {
          that.isLoadingLocal = true
          that.searchCollab(newVal).then(function (result) {
            if (that.errorMessage !== '') {
              that.errorMessage = ''
            }
            if (result.length === 0) {
              that.collabResults = [{'title': 'No found'}]
            } else {
              that.collabResults = result
            }
            that.isLoadingLocal = false
          }, () => {
            that.errorMessage = 'Getting your collabs ...'
          })
        }, 500)
      }
    }
  }
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
