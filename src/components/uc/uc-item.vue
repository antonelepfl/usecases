
<template>
  <div class="uc-item">
    <div class="item-picture">
       <img :src="uc.picture.src" :alt="uc.picture.alt">
    </div>
    <uc-description class="uc-description" :uc="uc"></uc-description>
    <uc-tags class="" :uc="uc" :categories="categories"></uc-tags>
    <video-tutorial :uc="uc"/>
  </div>
</template>


<script>
import UcDescription from './uc-description.vue';
import UcTags from './uc-tags.vue';
import VideoTutorial from './video-tutorial.vue';

export default {
  name: 'ucItem',
  components: {
    UcDescription,
    UcTags,
    VideoTutorial,
  },
  props: {
    uc: {
      type: Object,
    },
    categories: {
      type: Object,
    },
  },
};
</script>
