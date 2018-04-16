<template>
  <div class="defaultList">
    <uc-container key="container"></uc-container>
  </div>
</template>

<script>

import ucContainer from '@/components/uc/uc-container.vue'

export default {
  name: 'defaultList',
  components: {
    'uc-container': ucContainer
  },
  props: ['list_usecases'],
}
</script>
