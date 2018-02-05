<template>
   <div class="models-list">
    <md-whiteframe md-elevation="1" class="item-sections" v-for="model in showingModels" v-bind:key="model">
      <model-item
        class="model-item"
        :model="model"
        v-on:touched="touched(model)"
        v-on:addSearch="addSearch"></model-item>
    </md-whiteframe>

    <infinite-loading
      :on-infinite="onInfinite" 
      ref="infiniteLoading"
      spinner="spiral"
    >
      <span slot="no-more"></span>
      <span slot="no-results"></span>
    </infinite-loading>
   </div>
</template>

<script>
   import modelItem from 'components/singlecellmodeling/model-item.vue'
   import InfiniteLoading from 'vue-infinite-loading'

   export default {
      name: 'modelsList',
      components: {
         'model-item': modelItem,
         'infinite-loading': InfiniteLoading
      },
      data () {
         return {
            showingModels: []
         }
      },
      props: ['models'],
      methods: {
        touched (modelItem) {
          this.$emit('selected', modelItem)
        },
        onInfinite () {
          let temp = [];
          let size = this.showingModels.length
          // obtain the next elements
          temp = this.models.slice(size, size + 10);
          this.showingModels = this.showingModels.concat(temp);
          if (this.models.length > this.showingModels.length) {
            // we have more items. next time scroll try to get new ones
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
          } else {
            // there is no more models. when scroll show the end
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        },
        addSearch (obj) {
          this.$emit('tagfilter', obj)
        },
        initializeItems () {
          this.showingModels = this.models.slice(0, 10)
          if (this.$refs.infiniteLoading) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
          }
        }
      },
      created () {
        this.initializeItems()
      },
      watch: {
        'models' () {
          this.initializeItems()
        }
      }
   }
</script>

<style scoped>
   .models-list {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
   }
   .models-list .item-sections {
      margin-top: 10px;
      margin-bottom: 15px;
      padding: 9px;
      border: 3px solid white;
   }
   .models-list .selected {
      background-color: lightgray;
      transition: background-color 0.5s ease;
   }
   .models-list .item-sections:hover {
      transition: 0.3s ease;
      box-shadow: 0 6px 6px -3px rgba(0, 0, 0, 0.2), 0 10px 14px 1px rgba(0, 0, 0, 0.14), 0 4px 18px 3px rgba(0, 0, 0, 0.12);
   }
</style>
<style>
  .flip-list-move {
    transition: transform 1s;
  }
</style>
