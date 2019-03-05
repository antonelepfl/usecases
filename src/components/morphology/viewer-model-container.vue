<template>
   <div>
    <div class="title-uc">Please select a model</div>
    <div class="content-uc">
      <md-whiteframe md-elevation="1">
        <div class="search-container-models">
          <i class="material-icons">search</i>
          <input
            class="searchbox-models"
            type="text"
            v-model="filter"
            placeholder="Search e.g 'Hippocampus' or click on the item's title to filter"
          >
        </div>
      </md-whiteframe>
      <models-list :models="models" v-on:selected="touched" v-on:tagfilter="addSearch"></models-list>
    </div>
   </div>
</template>

<script>
import BspNmcModelList from '@/components/shared/models-list.vue';
import collabAuthentication from '@/mixins/collabAuthentication';
import createCollab from '@/mixins/createCollab';
import modelsMixins from '@/mixins/models';

const VIEWER_URL = 'https://bbp.epfl.ch/public/morph-view/';

export default {
  name: 'modelContainer',
  components: {
    'models-list': BspNmcModelList,
  },
  data() {
    return {
      models: [],
      originalModels: [],
      filter: '',
    };
  },
  mixins: [collabAuthentication, createCollab],
  props: ['list_usecases', 'uc_name'],
  methods: {
    touched(modelItem) {
      const viewUrl = `${VIEWER_URL + modelItem.folderName}.html`;
      window.open(viewUrl, '_blank');
      const category = this.$route.path.split('/')[1];
      this.sendStatistics(null, this.uc_name, category, modelItem.folderName, null);
    },
    addSearch(obj) {
      this.filter += ` ${obj.text}`;
    },
    loadNMCModels() {
      const NMCList = modelsMixins.getNMCMetadata();
      this.models = this.models.concat(NMCList);
      this.originalModels = this.models;
    },
  },
  created() {
    const that = this;
    document.querySelector('title').innerHTML = 'Models';
    this.models = modelsMixins.getHippocampusMetadata();
    if (window.requestIdleCallback) {
      window.requestIdleCallback(that.loadNMCModels);
    } else {
      that.loadNMCModels();
    }
  },
  watch: {
    async filter(newVal) {
      this.models = await modelsMixins.search(newVal, this.originalModels);
    },
  },
};
</script>
