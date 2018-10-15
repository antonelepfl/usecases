<template>
  <div class="model-item-custom" v-if="model">
    <div class="path" @click="search">
      <div class="inline" v-for="(part, index) in pathParts" :key="index">
        <span class="square">{{ part }}</span>
        <span v-show="hasNext(index)"> > </span>
      </div>
    </div>

    <div class="item-body" @click="touched">
      <div class="images-container">
        <img :src="model.morphImg" class="half" alt="image of morphology">
        <img :src="model.reponsesImg" class="half" alt="image of reponses traces">
      </div>
      <div class="description-container">
        <model-description class="model-description" :model="model"></model-description>
      </div>
    </div>

  </div>
</template>

<script>
  import ModelDescription from './model-description.vue'
  import placeholder from '@/assets/images/placeholder.jpg'

  export default {
    name: 'modelItem',
    components: {
      ModelDescription
    },
    props: {
      model: Object
    },
    data () {
      return {
        pathParts: [],
        path: '',
        placeholder: placeholder
      }
    },
    methods: {
      hasNext (index) {
        return index < (this.pathParts.length - 1)
      },
      touched () {
        this.$emit('touched')
      },
      search (event) {
        let searchText = event.target.innerText
        if (searchText !== '>') {
          this.$emit('addSearch', {
            'text': searchText
          })
        }
      }
    },
    mounted () {
      this.pathParts = this.model.modelTitle.split(' ')
      this.path = this.pathParts.join(' > ')
    }
  }
</script>

<style scoped>
  .item-body {
    cursor: pointer;
  }
  .model-item-picture {
    align-items: center;
  }
  .path {
    background-color: rgba(130, 180, 195, 0.38);
    font-size: 20px;
    padding: 5px;
    text-shadow: 2px 2px rgba(120, 130, 253, 0.13);
    text-align: left;
    cursor: default;
  }
  .inline {
    padding: 4px;
    display: inline-block;
  }
  .inline span {
    padding-left: 4px;
    padding-right: 2px;
  }
  .square:hover {
    background-color: rgba(103, 103, 122, 0.35);
    border-radius: 5px;
  }
  .half {
    width: 49%;
  }
  .images-container {
    width: 45%;
    align-self: center;
    padding: 10px 10px 0 10px;
  }
  .description-container {
    width: 55%;
  }
  .item-body {
    display: flex;
  }
</style>
