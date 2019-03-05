<template>
   <div class="ca1-model-list">
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
import modelList from '@/components/shared/models-list.vue';
import modelsUtils from '@/mixins/models';

export default {
  name: 'ca1ModelList',
  components: {
    'models-list': modelList,
  },
  data() {
    return {
      models: [],
      originalModels: [],
      filter: '',
    };
  },
  methods: {
    touched(modelItem) {
      this.$emit('selected', modelItem);
    },
    addSearch(obj) {
      this.filter += ` ${obj.text}`;
    },
  },
  created() {
    document.querySelector('title').innerHTML = 'Models';
    this.originalModels = modelsUtils.getHippocampusMetadata();
    this.models = this.originalModels;
  },
  watch: {
    async filter(newVal) {
      this.models = await modelsUtils.search(newVal, this.originalModels);
    },
  },
};
</script>

<style scoped>
   .ca1-model-list .touched {
      animation: shake 0.5s;
      border: 3px solid;
   }
</style>
