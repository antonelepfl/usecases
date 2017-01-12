<template>
  <div class="posts">
    <div class="main-content">
      <div v-if="error" class="error">
        {{ error }}
      </div>
      <div class="loading" v-if="loading">Loading... Plase wait</div>
      <div v-else>
        <!--Autcomplete section-->
        <multiselect v-model="post" :options="options" 
          placeholder="Select one" 
          label="title" track-by="id"
          :loading="isLoading" :internal-search="true"
          :options-limit="300" :limit="3"
          ></multiselect>
        <div class='post-body' v-bind:selection='post' :key='post.id'>
          <h3>Title</h3>
          <h4>{{ post.title }}</h4>
          <h3>Body</h3>
          <h4>{{ post.body }}</h4>
          <h3>Id</h3>
          <h4>{{ post.id }}</h4>
        </div>
        <transition-group name="slide" class="container-transition">
          <div v-if="posts" v-for='post in posts' class="content" :key="post.id">
            <h3>{{ post.title }}</h2>
          </div>
        </transition-group>
      </div>
    </div>
    <navigation-buttons 
      v-bind:prev='configroutes.home' 
      v-bind:next='configroutes.modelconfig'></navigation-buttons>
  </div>
</template>

<script>
import VueJsonp from 'vue-jsonp'
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import NavigationButtons from './navigation-buttons'
import Multiselect from 'vue-multiselect'
var configroutes = require('../assets/routes.json')

Vue.use(VueJsonp)
Vue.use(VueMaterial)

export default {
  name: 'posts',
  data () {
    return {
      loading: false,
      posts: [],
      error: null,
      post: {},
      options: [],
      isLoading: false,
      configroutes: configroutes
    }
  },
  components: {
    NavigationButtons, Multiselect
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = null
      this.posts = []
      this.loading = true
      this.$jsonp('http://jsonplaceholder.typicode.com/posts').then(json => {
        this.handlePost(json)
        this.post = json[0]
        this.options = json
      }, err => {
        console.error(err)
        // Failed.
      })
    },
    handlePost (json) {
      var posts = this.posts
      // load in cascade with timeout
      var i = 0
      var howManyTimes = json.length
      function f () {
        posts.push(json[i])
        i++
        if (i < howManyTimes) {
          setTimeout(f, 50)
        }
      }
      f()
      this.loading = false
    }
  }
}
</script>

<style>
  .loading {
    padding: 12px;
    font-size: 30px;
  }
  .error {
    color: red;
  }
  .content {
    transition: all .35s ease;
    width: 48%;
  }
  .content > h3 {
    margin: 8px;
  }
  .slide-enter {
    opacity: 0;
    transform: translate(30px, 0);
  }
  .slide-leave-active {
    opacity: 0;
    transform: translate(-30px, 0);
  }
  .container-transition {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
  }
  .main-content {
    padding: 16px;
    height: 90vh;
    overflow: scroll;
  }
  .post-body {
    margin-top: 10px;
    padding: 10px;
    text-align: center;
    border-style: dotted;
    border-width: 2px;
  }
  @media(max-width: 400px) {
    .content > h3 {
      font-size: 5vw;
    }
  }
</style>