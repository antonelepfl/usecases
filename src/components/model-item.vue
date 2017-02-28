<template>
  <div class="model-item">
    <div class="path" v-on:click="touched">
      <div class="inline" v-for="(part, index) in pathParts">
        <span class="square">{{ part }}</span>
        <span v-show="hasNext(index)"> > </span>
      </div>
    </div>
    <div class="section">
      <model-description class="model-description" :model="model" v-on:touched="touched"></model-description>
    </div>
  </div>
</template>

<script>
  import modelDescription from './model-description.vue'

  export default {
    name: 'modelItem',
    components: {
      modelDescription
    },
    props: {
      model: Object
    },
    data () {
      return {
        pathParts: []
      }
    },
    methods: {
      showImage (event) {
        this.$emit('showimage', {'src': event.target.src, 'path': this.path})
      },
      hasNext (index) {
        return index < (this.pathParts.length - 1)
      },
      touched (event) {
        var el = event.currentTarget
        var found = true
        while (el.parentNode && found) {
          el = el.parentNode
          if (el.className.indexOf('model-item') > -1) {
            this.$emit('touched', el) // return the root component
            found = false
          }
        }
      },
      getPath () {
        // TODO: change this species from the json file when the field is added
        this.pathParts.push('Rat')
        this.pathParts.push(this.model.brain_structure)
        this.pathParts.push(this.model.cell_soma_location + '-' + this.model.cell_type)
        this.pathParts.push(this.model['e-type'])
        this.pathParts.push(this.model.morphology)
      }
    },
    mounted () {
      this.model
      this.getPath()
      debugger
    }
  }
</script>

<style>
  .model-item {
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
</style>
