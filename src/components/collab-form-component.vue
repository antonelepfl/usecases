<template>
  <!-- This component emits 'collabSelected' and 'collabCreated' events to the parent-->
  <div class="collab-form-component">
    <div class="header">Define in which collab you want to work</div>
    <div class="tabs is-toggle is-fullwidth is-large" @click="toggleIsSearch">
      <ul class="custom-tabs">
        <li id="searchTab" :class="{'is-active': isSearch}">
          <a>
            <span class="icon"><i class="material-icons">search</i></span>
            <span>Search</span>
          </a>
        </li>
        <li id="createTab" :class="{'is-active': !isSearch}">
          <a>
            <span class="icon"><i class="material-icons">create</i></span>
            <span>Create</span>
          </a>
        </li>
      </ul>
    </div>
    <transition-group name="fade-form" v-on:before-leave="beforeLeave">
      <div class="search-container column is-half is-offset-one-quarter" v-show="isSearch" key="search">
        <md-input-container>
          <label>Collab Name</label>
          <md-input placeholder="Search in your collabs" v-model.lazy="searchText"></md-input>
        </md-input-container>

        <div v-if="!isLoadingLocal" class="collabs-results-container">
          <div v-for="collab in collabResults" :key="collab.title" class="collab-result" >
            <a class="nota" @click="collabSelected(collab)">{{ collab.title }}</a>
          </div>
        </div>
      </div>

      <div class="create-container column is-half is-offset-one-quarter" v-show="!isSearch" key="create">
        <md-input-container>
          <label>Collab Name</label>
          <md-input placeholder="Create new collab" v-model.lazy="searchText"></md-input>
        </md-input-container>

        <div v-show="!isLoadingLocal" class="centered">
          <md-button id="createButton" class="md-raised md-primary button-medium separated" @click.native="createNewCollab">Create</md-button>
          <md-switch v-model="isPrivate" id="priv_pub" name="priv_pub" class="md-primary priv_pub separated">{{private_public}}</md-switch>
        </div>
      </div>
    </transition-group>

    <div v-show="isLoadingLocal" class="progress-bar column is-half is-offset-one-quarter">
      <md-progress class="md-accent" md-indeterminate></md-progress>
    </div>
    <span class="error-message">{{errorMessage}}</span>

  </div>
</template>

<script>
  import createCollab from '@/mixins/createCollab.js'
  
  export default {
    name: 'collabFormComponent',
    props: ['isLoading'],
    data () {
      return {
        isPrivate: false,
        searchText: '',
        collabResults: [],
        errorMessage: '',
        isLoadingLocal: this.isLoading,
        isSearch: true,
        timeoutId: 0 // to delay the collab search
      }
    },
    mixins: [createCollab], // use common functions
    computed: {
      private_public () {
        if (this.isPrivate) {
          return 'Private'
        }
        return 'Public'
      }
    },
    methods: {
      collabSelected: function (collab) {
        let that = this
        this.getCollabStorage(collab.id).then(() => {
          that.$emit('collabSelected', collab)
        })
      },
      createNewCollab () {
        var that = this
        this.errorMessage = ''
        if (!this.searchText) {
          this.errorMessage = 'Name is require'
          return
        }
        var isPrivate = (this.$el.querySelector('#priv_pub').value === 'true') // to convert in bool
        this.isLoadingLocal = true
        this.createCollab(this.searchText, isPrivate)
        .then(function (collab) {
          that.getCollabStorage(collab.id).then(() => {
            that.$emit('collabCreated', collab)
          })
        }, (error) => {
          that.errorMessage = error
          that.isLoadingLocal = false
        })
      },
      search (newVal) {
        var that = this
        if (newVal === '') {
          that.collabResults = []
          that.errorMessage = ''
        } else if (this.isSearch) {
          // check for collabs only while searching
          that.isLoadingLocal = true
          this.searchCollab(newVal).then((result) => {
            if (that.errorMessage !== '') {
              that.errorMessage = ''
            }
            that.collabResults = result
            that.isLoadingLocal = false
          }, () => {
            that.errorMessage = 'Getting your collabs ...'
            that.isLoadingLocal = false
          })
        }
      },
      toggleIsSearch (event) {
        if (event.target.innerText.toLowerCase().includes('search')) {
          this.isSearch = true;
        } else this.isSearch = false;
      },
      beforeLeave (el) {
        // hide so we don't see juping when the new enters
        el.style.display = 'none'
      },
    },
    watch: {
      'searchText' (newVal) {
        var that = this
        clearTimeout(this.timeoutId)
        this.timeoutId = setTimeout(() => {
          that.search(newVal)
        }, 500)
      },
      'isLoading' (newVal) {
        this.isLoadingLocal = newVal
      }
    }
  }
</script>

<style>
  .centered > * {
    min-width: 120px;
    margin-left: 10px;
  }
  .button-medium {
    max-width: 150px;
  }
  .collab-form-component .md-theme-default.md-tabs>.md-tabs-navigation {
    background-color: #ac6067;
  }
  .collab-form-component .md-tabs-content {
    width: 550px;
    margin: 0 auto;
  }
  .collab-form-component .md-theme-default.md-button:not([disabled]).md-primary.md-raised.button-medium {
    background-color: #ac6067;
  }
  .collab-form-component button.md-tab-header.md-active {
    background-color: #884f4d;
    color: white;
  }
  .collab-form-component .md-theme-default.md-tabs>.md-tabs-navigation .md-tab-indicator {
    background-color: #1c287e;
  }
  .collab-form-component .md-theme-default.md-tabs>.md-tabs-navigation {
    background-color: #ac6067;
  }
  .collab-form-component .priv_pub {
    font-size: 20px;
  }
  .collab-form-component .login-logout {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .collab-form-component .header {
    text-align: center;
    color: #fff;
    background-color: rgb(172, 96, 103);
    padding: 25px 20px;
    font-size: 20px;
    font-weight: 600;
    width: 100%;
  }
  .collab-form-component .elevated {
    min-height: 300px;
  }
  .collabs-results-container {
    max-height: 400px;
    overflow: scroll;
  }
  .collabs-results-container .collab-result > a.nota {
    color: #ac6067;
    cursor: pointer;
    padding: 10px;
  }
  .collab-form-component span.error-message {
    display: block;
    color: red;
    margin-left: 25px;
  }
  .tabs.is-toggle .custom-tabs li.is-active a {
    background-color: #884f4d;
    border-color: #884f4d;
  }
  .tabs.is-toggle .custom-tabs li a {
    background-color: #ac6067;
    border-color: #ac6067;
    color: white;
    text-decoration: none;
  }
  .tabs.is-toggle .custom-tabs li:first-child a {
    border-radius: 0;
  }
  ul:not(.md-list) > li + li {
    margin: 0;
  }
  /* Enter and leave animations */
  .fade-form-enter-active {
    animation: bounce-in .5s;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
