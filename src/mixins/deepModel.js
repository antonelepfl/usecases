
import createCollab from '@/mixins/createCollab';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import usecases from '@/assets/config_files/usecases.json';
import { compactString } from '@/mixins/utils';

export default {
  data() {
    return {
      usecases: usecases[0],
      // root like circuitbuiling, smallcircuitinsilicoexperiments
      root: '',
    };
  },
  mixins: [createCollab],
  mounted() {
    const path = this.$route.fullPath.split('/');
    if (path && path.length > 1) {
      [, this.root] = path;
    }
  },
  methods: {
    createItemInExistingCollabDeepModel(collab, uc, model) {
      const ucInfo = this.getUsecaseInfo(uc, model);
      return this.createItemInExistingCollab(collab, uc, ucInfo);
    },
    getModelName(ucName, modelName) {
      if (!modelName) return null;
      const modelInfo = this.getUsecaseInfo(ucName, modelName);
      return modelInfo.title;
    },
    getUsecaseInfo(uc, model) {
      const categoryInfo = find(this.usecases[this.root], category => compactString(category.title) === uc);
      const index = findIndex(categoryInfo.models, m => compactString(m.title) === model);
      return categoryInfo.models[index];
    },
  },
};
