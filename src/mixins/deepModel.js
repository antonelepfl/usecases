
import createCollab from '@/mixins/createCollab';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import usecases from '@/assets/config_files/usecases.json';

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
    uglyfy(name) {
      return name.split(' ').map(word => word.toLowerCase()).join('');
    },
    getModelName(modelName) {
      if (!modelName) return null;
      const modelInfo = find(this.usecases[this.root], elem => this.uglyfy(elem.title) === this.uc_name);
      return modelInfo.title;
    },
    getUsecaseInfo(uc, model) {
      function compact(name) {
        return name.toLowerCase().replace(/ /g, '');
      }
      const categoryInfo = find(this.usecases[this.root], category => compact(category.title) === uc);
      const index = findIndex(categoryInfo.models, m => compact(m.title) === model);
      return categoryInfo.models[index];
    },
  },
};
