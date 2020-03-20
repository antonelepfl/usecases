<template>
   <div id="uc-container" class="uc-container">
      <uc-list-viewer :item-list="usecases" @selected="selected">

        <template v-slot:title>
          Please select a use case
          <commit-number></commit-number>
        </template>

        <template v-slot:default="slotProps">
          <uc-item v-bind:uc="slotProps.item" v-bind:categories="categories"/>
        </template>

      </uc-list-viewer>

      <!-- if the url is not correct show index of UCs -->
      <div v-if="!usecases">
         <div v-for="index in indexes" :key="index" class="category-item">
            <a @click="reload(index)">{{ index }}</a>
         </div>
      </div>
   </div>
</template>

<script>
import ucListViewer from '@/components/uc-list-viewer.vue';
import usecases from '@/assets/config_files/usecases.json';
import storageManager from '@/mixins/storageManager';
import commitNumer from '@/components/commit-number.vue';
import { compactString } from '@/mixins/utils';
import createCollab from '@/mixins/createCollab';
import ucItem from './uc-item.vue';

export default {
  name: 'ucContainer',
  components: {
    'uc-item': ucItem,
    'commit-number': commitNumer,
    'uc-list-viewer': ucListViewer,
  },
  data() {
    return {
      usecases: {},
      indexes: [],
      categories: usecases[1].categories,
      route: {},
    };
  },
  methods: {
    selected(uc) {
      if (!uc.disabled) {
        const ucName = compactString(uc.title);
        const category = this.$route.params.list_usecases;
        if (uc.dataprotected
                && !storageManager.termsAcceptedLocally(category)) {
          this.$router.push({
            name: 'termsandconditions',
            params: {
              list_usecases: category,
              uc_name: ucName,
            },
          });
        } else if (!uc.next && uc.external_link) {
          // open app in new tab and send statistics
          const sendStatisticsBinded = createCollab.methods.sendStatistics.bind(this);
          this.sendToForm = createCollab.methods.sendToForm;
          this.getUserInfo = createCollab.methods.getUserInfo;
          sendStatisticsBinded(null, ucName, null, null);

          window.open(uc.external_link, '_blank');
        } else {
          this.$router.push({ name: uc.next, params: { uc_name: ucName } });
        }
      }
    },
    prettyfy(name) {
      return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    },
    reload(newPage) {
      window.location.href = `${window.location.origin}/#/${newPage}`;
      window.location.reload();
    },
  },
  mounted() {
    const ucSelected = this.$route.path.replace(/\//g, '');
    this.usecases = usecases[0][ucSelected];
    if (!this.usecases) {
      this.indexes = Object.keys(usecases[0]);
    }
    const title = ucSelected;
    document.querySelector('title').innerText = this.prettyfy(title);
  },
};
</script>

<style scoped>
  .category-item {
    font-size: 18px;
    margin-top: 10px;
  }
</style>
