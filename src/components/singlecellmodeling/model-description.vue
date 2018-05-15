<template>
  <div class="model-description">
    <md-layout md-gutter>
      <md-layout class="model-column" md-column md-flex-large="100" md-flex-medium="100">
        <div class="credits">
          <b>Mod files:</b>
          <div>{{ model.channels }}</div>
        </div>
      </md-layout>
      <md-layout class="model-column" md-column md-flex-large="100" md-flex-medium="100">
        <div class="credits" v-if="model.contributors && model.contributors.length > 1">
          <b>Credits:</b>
          <div>Contributor(s):
            <span v-for="contributor in getContributorFormated(model)" :key="contributor">{{contributor}}</span>
          </div>
          <!-- <div>Reference:</div> -->
        </div>
      </md-layout>
    </md-layout>
  </div>
</template>

<script>
  import { getContributorFormated } from '@/mixins/utils.js'
  export default {
    name: 'modelDescription',
    props: {
      model: Object
    },
    data () {
      return {
        getContributorFormated
      }
    },
  }
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
