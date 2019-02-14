
<template>
  <div>
    <div class="title-uc">
      <slot name="title">TEST</slot>
      <!-- <commit-number></commit-number> -->
    </div>

    <div class="content-uc">
      <div
        v-for="item in itemList"
        :key="item.title"
        v-bind:class="{ 'disabled-container': item.disabled }"
        v-on:click="$emit('selected', item)"
      >
        <div v-if="item.disabled" class="disabled-tag">Coming Soon</div>
        <md-whiteframe
          md-elevation="2"
          class="item-sections"
          v-bind:class="{ 'disabled-item': item.disabled }"
        >
          <slot v-bind:item="item"/>
       </md-whiteframe>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'UcListViewer',
  props: ['item-list'],
  methods: {
  },
};
</script>
