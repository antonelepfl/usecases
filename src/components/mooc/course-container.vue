<template>
   <div id="course-container" class="course-container">
      <uc-list-viewer :item-list="usecases" @selected="selected">
        <template v-slot:title>Please select a course to initialize</template>

        <template v-slot:default="slotProps">
          <uc-item v-bind:uc="slotProps.item" v-bind:categories="categories"/>
        </template>
      </uc-list-viewer>
   </div>
</template>

<script>
import UcItem from '@/components/uc/uc-item.vue';
import UcListViewer from '@/components/uc-list-viewer.vue';
import usecases from '@/assets/config_files/usecases.json';
import collabAuthentication from '@/mixins/collabAuthentication';

export default {
  name: 'ucContainer',
  components: {
    UcItem,
    UcListViewer,
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
