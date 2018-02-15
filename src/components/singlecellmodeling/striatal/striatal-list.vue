<template>
   <div class="models-list">
    <md-whiteframe
      md-elevation="1"
      class="item-sections"
      v-for="model in models"
      v-bind:key="model.title"
    >
      <div class="path">
        <div class="inline">
          <span class="square">{{ model.title }}</span>
        </div>
      </div>

      <div class="item-body" @click="touched(model)">
        <div class="images-container">
          <img :src="model.img" class="" alt="image of morphology">
        </div>
        <div class="description-container">
          {{model.description}}
        </div>
      </div>
    </md-whiteframe>
   </div>
</template>

<script>
   export default {
      name: 'modelsList',
      props: ['models'],
      methods: {
        touched (modelItem) {
          this.$emit('selected', modelItem)
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
<style>
  .flip-list-move {
    transition: transform 1s;
  }
</style>
