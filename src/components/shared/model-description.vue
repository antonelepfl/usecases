<template>
  <div class="model-description">
    <md-layout md-gutter>
      <md-layout
        class="model-column"
        md-column md-flex-large="100"
        md-flex-medium="100"
        v-if="model.description"
      >
        <b>Description:</b>
        <div v-html="description"></div>
      </md-layout>

      <md-layout
        class="model-column"
        md-column md-flex-large="100"
        md-flex-medium="100"
        v-if="model.channels"
      >
        <b>Mod files:</b>
        <div>{{ model.channels }}</div>
      </md-layout>

      <md-layout
        class="model-column"
        md-column md-flex-large="100"
        md-flex-medium="100"
        v-if="model.author"
      >
        <b>Credits:</b>
        <div>Author(s):
          <span>{{model.author}}</span>
        </div>
      </md-layout>
    </md-layout>
  </div>
</template>

<script>
export default {
  name: 'modelDescription',
  props: {
    model: Object,
  },
  computed: {
    description() {
      if (!this.model.description) return '';
      // sanitize a little bit
      const proper = this.model.description.replace(/\\_/g, '_');
      return proper;
    },
  },
};
</script>

<style>
  .model-description .md-table-head-text.md-test {
    padding-left: 5px;
  }
  .model-description .md-table .md-table-cell .md-table-cell-container {
    padding-left: 5px;
    padding-right: 5px;
    text-align: left;
  }
  .md-table tbody .md-table-row:hover .md-table-cell {
    background-color: white;
  }
  .full {
    width: 100%;
  }
  .model-column {
    padding: 10px;
    text-align: justify;
    overflow: hidden;
  }
</style>
