<template>
   <div class="morphology-model-container">
      <ca1-model-list v-on:selected="touched"></ca1-model-list>
   </div>
</template>

<script>
import ca1ModelList from '@/components/shared/ca1-model-list.vue';
import createCollab from '@/mixins/createCollab';

export default {
  name: 'modelContainer',
  components: {
    'ca1-model-list': ca1ModelList,
  },
  mixins: [createCollab],
  props: ['list_usecases', 'uc_name'],
  methods: {
    touched(modelItem) {
      this.$router.push({
        name: 'morph_form_replacing',
        params: {
          folder_name: modelItem.folderName,
        },
      });
    },
  },
};
</script>
