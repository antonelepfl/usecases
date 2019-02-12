<template>
   <div id="course-container" class="course-container">
      <div id="course-container-title" class="title-uc">
        Please select a course to initialize
        <commit-numer></commit-numer>
      </div>
      <div class="content-uc">
        <div v-for="uc in usecases" :key="uc.title" v-bind:class="{ 'disabled-container': uc.disabled }" v-on:click="selected(uc)">
           <div v-if="uc.disabled" class="disabled-tag">Coming Soon</div>
           <md-whiteframe
            md-elevation="2"
            v-bind:class="{ 'item-sections': true, 'disabled-item': uc.disabled }"
           >
             <uc-item v-bind:uc="uc" v-bind:categories="categories"></uc-item>
           </md-whiteframe>
        </div>
      </div>
   </div>
</template>

<script>
import UcItem from '@/components/uc/uc-item.vue';
import usecases from '@/assets/config_files/usecases.json';
import collabAuthentication from '@/mixins/collabAuthentication';
import CommitNumer from '@/components/commit-number.vue';

export default {
  name: 'ucContainer',
  components: {
    UcItem,
    CommitNumer,
  },
  data() {
    return {
      usecases: {},
      categories: usecases[1].categories,
      route: {},
    };
  },
  mixins: [collabAuthentication],
  methods: {
    selected(uc) {
      if (!uc.disabled) {
        const title = uc.title.toLowerCase().replace(/\s/g, '');
        this.$router.push({
          name: uc.next,
          params: { uc_name: title },
          query: this.$route.query,
        });
      }
    },
    prettyfy(name) {
      return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    },
  },
  mounted() {
    const ucSelected = this.$route.path.replace(/\//g, '');
    this.usecases = usecases[0][ucSelected];
    const title = ucSelected;
    document.querySelector('title').innerText = this.prettyfy(title);
  },
};
</script>
