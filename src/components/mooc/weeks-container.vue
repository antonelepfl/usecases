<template>
   <div id="course-container" class="course-container">
      <div id="course-container-title" class="title">
        {{moocInfo.title}}
        <a v-if="moocInfo.course_url" :href="moocInfo.course_url" class="no-link right">
          <i>Link of the course</i>
          <i class="material-icons middle">link</i>
        </a>
      </div>
      <div v-for="uc in weeks" v-bind:class="{ 'disabled-container': uc.disabled }" v-on:click="selected(uc)">
         <div v-if="uc.disabled" class="disabled-tag">Coming Soon</div>
         <md-whiteframe md-elevation="2" v-bind:class="{ 'item-sections': true, 'disabled-item': uc.disabled }">
            <uc-item v-bind:uc="uc" v-bind:categories="categories"></uc-item>
         </md-whiteframe>
      </div>
   </div>
</template>

<script>
   import ucItem from 'components/uc/uc-item.vue'
   import usecases from 'assets/config_files/usecases.json'
   import collabAuthentication from 'mixins/collabAuthentication.js'
   import mooc from 'mixins/mooc.js'

   export default {
      name: 'ucContainer',
      components: {
         ucItem
      },
      data () {
         return {
            weeks: [],
            categories: usecases[1].categories,
            route: {},
            moocInfo: {}
         }
      },
      mixins: [collabAuthentication, mooc],
      methods: {
         selected (uc) {
            if (!uc.disabled) {
              var weekName = uc.title.toLowerCase().replace(/\s/g, '')

              this.$router.push({
                name: uc.next,
                params: {
                  'week': weekName,
                  'moocFullWeeks': this.weeks,
                  'moocFullName': this.moocInfo.title
                },
                query: this.$route.query
              })
            }
         },
         prettyfy (name) {
            return name.split('_').map(function (word) {
               return word.charAt(0).toUpperCase() + word.slice(1)
            }).join(' ')
         }
      },
      mounted () {
        var ucSelected = this.compact(this.$route.params.uc_name)
        // get the overall mooc info (title, url, etc)
        this.moocInfo = usecases[0].mooc.find((mooc) => {
          return this.compact(mooc.title) === ucSelected
        })
        document.querySelector('title').innerText = this.prettyfy(this.moocInfo.title)
        // get the external config for the weeks
        this.getMoocFullConfig(ucSelected)
        .then((config) => {
          this.weeks = config
        })
      }
   }
</script>

<style scoped>
   .course-container {
      padding: 10px;
      margin-top: 50px;
   }
   .course-container.no-title {
      padding: 10px;
      margin-top: 0;
   }
   .course-container .item-sections {
      margin-top: 20px;
      padding: 10px;
      cursor: pointer;
   }
   .course-container .selected {
      background-color: lightgray;
      transition: background-color 0.5s ease;
   }
   .course-container > .title {
      box-shadow: 0 2px 5px rgba(0,0,0,.26);
      position: fixed;
      text-align: left;
      color: #fff;
      background-color: rgba(172, 96, 103, 0.95);
      padding: 20px;
      font-size: 20px;
      font-weight: 600;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 3;
   }
   .course-container .disabled-tag {
      position: absolute;
      top: 15%;
      left: 45%;
      font-weight: 700;
      border: 10px solid #bacfcb;
      background-color: #bacfcb;
      border-radius: 5px;
      z-index: 2;
   }
   .course-container .disabled-item {
      opacity: 0.5;
      background-color: rgba(63, 58, 58, 0.22);
      cursor: not-allowed;
   }
   .course-container .disabled-item:hover {
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
   }
   .course-container .disabled-container {
      position: relative;
   }
   a.no-link {
      color: #aacff1;
      cursor: pointer;
   }
   a.no-link:hover {
      color: #000000;
   }
   .middle {
      vertical-align: middle;
   }
   .right {
      float: right;
   }
   @media screen and (max-width: 751px) {
      .course-container .disabled-tag {
         left: 35%;
      }
   }
</style>
