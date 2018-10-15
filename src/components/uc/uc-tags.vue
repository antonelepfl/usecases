<template>
   <div class="uc-tags">
      <div class="exp">
         <b v-for="(exp, index) in uc.experience" :key="index">
            <md-chip v-bind:class="getClassByPrefix('exp-',exp)" disabled>{{ fullName('experience',exp) }}</md-chip>
            <md-tooltip md-direction="left">{{getTooltipByPrefix('experience',exp)}}</md-tooltip>
         </b>
      </div>

      <div class="divider"></div>

      <div class="mat-acc">
        <span v-if="uc.maturity">
          <b
            v-for="(mat, index) in uc.maturity"
            :key="'maturity' + index"
          >
            <div
              v-if="mat"
              v-bind:class="getClassByPrefix('mat-',mat)"
              class="image-tag-size"
              title="maturity"
            />
            <md-tooltip md-direction="left">{{getTooltipByPrefix('maturity',mat)}}</md-tooltip>
          </b>
        </span>
        <span v-if="uc.access">
          <b
            v-for="(access, index) in uc.access"
            :key="'access' + index"
          >
            <div
              v-if="access"
              v-bind:class="getClassByPrefix('access-',access)"
              class="image-tag-size"
              title="access"
            />
            <md-tooltip md-direction="left">{{getTooltipByPrefix('access',access)}}</md-tooltip>
          </b>
        </span>
      </div>

   </div>
</template>

<script>
   export default {
      name: 'uc-tags',
      props: {
         uc: {
            type: Object,
            default () { return {} }
         },
         categories: {
            type: Object
         }
      },
      methods: {
         getClassByPrefix (prefix, type) {
            var key = prefix + type
            var data = { [key]: true }
            return data
         },
         getTooltipByPrefix (prefix, type) {
            var tooltip = ''
            if (prefix && type) {
               tooltip = this.categories[prefix][type].tooltip
            }
            return tooltip
         },
         fullName (prefix, elem) {
            return this.categories[prefix][elem].name
         }
      }
   }
</script>

<style scoped>
.all {
   color: gray;
}
.uc-tags.tags {
  margin-bottom: 0;
}
/* Experiences levels */
.md-chip.md-theme-default.exp-all {
   background-color: #CCFFCC;
}
.md-chip.md-theme-default.exp-power {
   background-color: #ffffb3;
}
.md-chip.md-theme-default.exp-experts {
   background-color: #f9cfa1;
}
.md-chip.md-theme-default.exp-code {
   background-color: #ebc3c3;
}
.md-chip.md-theme-default {
  margin-bottom: 5px;
}
/* Maturity level */
.mat-beta {
   background-image: url('https://raw.githubusercontent.com/antonelepfl/usecases/dev/src/assets/images/Maturity_BETA_48x48.png');
   margin-bottom: 5px;
}
.mat-experimental {
   background-image: url('https://raw.githubusercontent.com/antonelepfl/usecases/dev/src/assets/images/Maturity_EXP_48x48.png');
}
/* Access level */
.access-hpc {
   background-image: url('https://raw.githubusercontent.com/antonelepfl/usecases/dev/src/assets/images/Access_HPC_48x48.png');
}
.access-byor {
   background-image: url('https://raw.githubusercontent.com/antonelepfl/usecases/dev/src/assets/images/Access_BYO_48x48.png');
}
.mat-acc {
   display: flex;
   justify-content: center;
}
.image-tag-size {
   width: 38px;
   height: 38px;
   background-size: 100% 100%;
}
@media screen and (max-width: 1500px) {
   .tags {
      display: block;
   }
   .divider {
      display: none;
   }
   .md-chip {
      font-size: 12px;
   }
   .mat-acc, .exp {
      width: 100%;
   }
}
@media screen and (max-width: 500px) {
  .image-tag-size {
    width: 20px;
    height: 20px;
  }
  .md-chip {
    font-size: 8px;
    border-radius: 13px;
    padding: 10px 5px;
  }
  .mat-acc {
    flex-direction: column;
    align-items: center;
  }
}
</style>
