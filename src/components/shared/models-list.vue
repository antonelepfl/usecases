<template>
   <div class="models-list">
    <md-whiteframe
      md-elevation="1"
      class="item-sections"
      v-for="model in showingModels"
      v-bind:key="model.title"
    >
      <model-item
        class="model-item-with-path"
        :model="model"
        v-on:touched="touched(model)"
        v-on:addSearch="addSearch">
      </model-item>
    </md-whiteframe>

    <infinite-loading
      @infinite="onInfinite"
      ref="infiniteLoading"
      spinner="spiral"
    >
      <span slot="no-more"></span>
      <span slot="no-results"></span>
    </infinite-loading>
   </div>
</template>

<script>
   import modelItem from '@/components/shared/model-item.vue'
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
        onInfinite ($state) {
          let temp = [];
          let size = this.showingModels.length
          // obtain the next elements
          temp = this.models.slice(size, size + 10);
          this.showingModels = this.showingModels.concat(temp);
          if (this.models.length > this.showingModels.length) {
            // we have more items. next time scroll try to get new ones
            $state.loaded()
          } else {
            // there is no more models. when scroll show the end
            $state.complete()
          }
        },
        addSearch (obj) {
          this.$emit('tagfilter', obj)
        },
        initializeItems () {
          this.showingModels = []
          this.$nextTick(() => {
            this.showingModels = this.models.slice(0, 10)
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
          })
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

<style>
  .flip-list-move {
    transition: transform 1s;
  }
</style>
